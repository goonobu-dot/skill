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

async function recentAgentHints(): Promise<RawAgent[]> {
  const roots = [
    join(CURSOR_HOME, "projects"),
    join(CURSOR_HOME, "ai-tracking"),
    join(CURSOR_HOME, "chats"),
  ];
  const files: string[] = [];
  for (const root of roots) {
    if (!existsSync(root)) continue;
    try {
      const entries = await readdir(root, { withFileTypes: true });
      for (const e of entries.slice(0, 20)) {
        const full = join(root, e.name);
        if (e.isFile() && /\.(json|jsonl|log|txt)$/i.test(e.name)) {
          files.push(full);
        }
      }
    } catch {
      // ignore
    }
  }

  const agents: RawAgent[] = [];
  for (const file of files.slice(0, 10)) {
    try {
      const st = await stat(file);
      if (Date.now() - st.mtimeMs > 1000 * 60 * 60 * 6) continue;
      const text = (await readFile(file, "utf8")).slice(-4000);
      let state: RawAgent["state"] = "idle";
      if (/error|failed/i.test(text)) state = "error";
      else if (/awaiting|approval|needs.?input/i.test(text)) {
        state = "needs_input";
      } else if (/streaming|tool_call|generating|thinking/i.test(text)) {
        state = "thinking";
      } else if (/completed|done/i.test(text)) state = "done";
      agents.push({
        id: file,
        title: file.split("/").pop()!.slice(0, 40),
        state,
        updatedAt: st.mtimeMs,
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
    const hinted = await recentAgentHints();

    if (hinted.length) {
      return {
        tool: "cursor",
        agents: hinted.slice(0, 8),
        health: "degraded",
        note: "Cursor status is best-effort (no public local agent API)",
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
        note: "Cursor running; per-agent colors unavailable",
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
