import { existsSync } from "node:fs";
import { readdir, readFile, stat } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import type { RawAgent } from "../types.js";
import type { AdapterResult, ToolAdapter } from "./types.js";

const execFileAsync = promisify(execFile);
const CURSOR_HOME = join(homedir(), ".cursor");
const PROJECTS = join(CURSOR_HOME, "projects");

async function cursorRunning(): Promise<boolean> {
  try {
    const { stdout } = await execFileAsync("pgrep", ["-lf", "Cursor"], {
      timeout: 1500,
    });
    return /Cursor\.app|Cursor Helper/i.test(stdout);
  } catch {
    return false;
  }
}

async function listTranscripts(): Promise<string[]> {
  if (!existsSync(PROJECTS)) return [];
  const out: string[] = [];
  let projects: string[] = [];
  try {
    projects = (await readdir(PROJECTS)).slice(0, 80);
  } catch {
    return [];
  }
  for (const proj of projects) {
    const dir = join(PROJECTS, proj, "agent-transcripts");
    if (!existsSync(dir)) continue;
    try {
      const walk = async (d: string, depth = 0): Promise<void> => {
        if (depth > 3) return;
        const entries = await readdir(d, { withFileTypes: true });
        for (const e of entries) {
          const full = join(d, e.name);
          if (e.isDirectory()) await walk(full, depth + 1);
          else if (e.name.endsWith(".jsonl")) out.push(full);
        }
      };
      await walk(dir);
    } catch {
      // ignore
    }
  }
  return out;
}

function inferState(lines: string[], ageSec: number): RawAgent["state"] {
  const last = (lines[lines.length - 1] || "").toLowerCase();
  const prev = (lines[lines.length - 2] || "").toLowerCase();

  if (/turn_ended/.test(last) && /error|fail/.test(last)) return "error";
  if (/needs.?input|awaiting|approval|waiting_for_user|interrupted/.test(last)) {
    return "needs_input";
  }

  // Open user turn (no turn_ended after it) => agent is working.
  // Transcripts often don't flush assistant chunks until later, so don't rely on mtime alone.
  if (/role":"user"|user_query/.test(last)) {
    return ageSec <= 60 * 30 ? "thinking" : "idle";
  }

  // Assistant chunks currently streaming / just written
  if (/role":"assistant"|tool_call|function_call/.test(last) && ageSec <= 15) {
    return "thinking";
  }

  if (/turn_ended/.test(last)) {
    if (ageSec <= 90) return "done";
    return "idle";
  }

  // Assistant finished recently but turn_ended not yet written
  if (/role":"assistant"/.test(last) && ageSec <= 90) return "done";
  if (/role":"assistant"/.test(prev) && /turn_ended/.test(last) && ageSec <= 90) {
    return "done";
  }

  return "idle";
}

async function agentsFromTranscripts(): Promise<RawAgent[]> {
  const files = await listTranscripts();
  const ranked: { file: string; mtime: number }[] = [];
  for (const file of files) {
    try {
      const st = await stat(file);
      // ignore stale (> 6h)
      if (Date.now() - st.mtimeMs > 1000 * 60 * 60 * 6) continue;
      ranked.push({ file, mtime: st.mtimeMs });
    } catch {
      // ignore
    }
  }
  ranked.sort((a, b) => b.mtime - a.mtime);

  const agents: RawAgent[] = [];
  for (const item of ranked.slice(0, 8)) {
    try {
      const text = await readFile(item.file, "utf8");
      const lines = text.trim().split(/\n+/);
      const ageSec = (Date.now() - item.mtime) / 1000;
      const state = inferState(lines, ageSec);
      const base = item.file.split("/").slice(-2).join("/");
      agents.push({
        id: item.file,
        title: base.slice(0, 36),
        state,
        updatedAt: item.mtime,
        focusAction: { kind: "activate_app", payload: "Cursor" },
      });
    } catch {
      // ignore
    }
  }
  return agents;
}

export const cursorAdapter: ToolAdapter = {
  tool: "cursor",
  async collect(): Promise<AdapterResult> {
    const running = await cursorRunning();
    const fromTranscripts = await agentsFromTranscripts();

    if (fromTranscripts.length) {
      const active = fromTranscripts.some((a) => a.state !== "idle");
      return {
        tool: "cursor",
        agents: fromTranscripts,
        health: active ? "ok" : "degraded",
        note: active
          ? "Cursor agent activity from local transcripts"
          : "Cursor transcripts found; no active turn detected",
      };
    }

    if (running) {
      return {
        tool: "cursor",
        agents: [
          {
            id: "cursor-app",
            title: "Cursor",
            state: "idle",
            updatedAt: Date.now(),
            focusAction: { kind: "activate_app", payload: "Cursor" },
          },
        ],
        health: "degraded",
        note: "Cursor running; no recent agent transcripts",
      };
    }

    return {
      tool: "cursor",
      agents: [],
      health: "degraded",
      note: "Cursor not detected",
    };
  },
};
