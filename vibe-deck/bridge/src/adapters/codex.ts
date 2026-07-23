import { existsSync } from "node:fs";
import { readdir, readFile, stat } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import type { AgentState, RawAgent } from "../types.js";
import type { AdapterResult, ToolAdapter } from "./types.js";

const CODEX_HOME = process.env.CODEX_HOME || join(homedir(), ".codex");

function mapState(raw: string): Exclude<AgentState, "empty"> {
  const s = raw.toLowerCase();
  if (/(error|failed|fail)/.test(s)) return "error";
  if (/(needs_input|awaiting|waiting|approval|question|interrupt)/.test(s)) {
    return "needs_input";
  }
  if (/(task_started|thinking|running|in_progress|working)/.test(s)) {
    return "thinking";
  }
  if (/(task_complete|completed|done|finished)/.test(s)) return "done";
  return "idle";
}

async function walkFiles(dir: string, depth = 0): Promise<string[]> {
  if (depth > 3 || !existsSync(dir)) return [];
  const out: string[] = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
      out.push(...(await walkFiles(full, depth + 1)));
    } else if (/\.(jsonl|json|log)$/i.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

async function parseFile(path: string): Promise<RawAgent | null> {
  let text: string;
  try {
    const st = await stat(path);
    // Skip huge files
    if (st.size > 2_000_000) return null;
    text = await readFile(path, "utf8");
  } catch {
    return null;
  }

  const lines = text.trim().split(/\n+/).slice(-40);
  let state: Exclude<AgentState, "empty"> = "idle";
  let title = path.split("/").slice(-2).join("/");
  let updatedAt = Date.now();

  for (const line of lines) {
    try {
      const obj = JSON.parse(line);
      const event =
        obj.type || obj.event || obj.status || obj.state || obj.kind || "";
      if (typeof event === "string" && event) state = mapState(event);
      if (obj.title || obj.name || obj.thread_id || obj.id) {
        title = String(obj.title || obj.name || obj.thread_id || obj.id).slice(
          0,
          40,
        );
      }
      if (obj.timestamp || obj.ts || obj.updatedAt) {
        const t = Date.parse(String(obj.timestamp || obj.ts || obj.updatedAt));
        if (!Number.isNaN(t)) updatedAt = t;
      }
    } catch {
      if (/task_started|thinking|running/i.test(line)) state = "thinking";
      if (/task_complete|completed/i.test(line)) state = "done";
      if (/needs_input|awaiting|approval/i.test(line)) state = "needs_input";
      if (/error|failed/i.test(line)) state = "error";
    }
  }

  return {
    id: path,
    title,
    state,
    updatedAt,
    focusAction: { kind: "activate_app", payload: "ChatGPT" },
  };
}

export const codexAdapter: ToolAdapter = {
  tool: "codex",
  async collect(): Promise<AdapterResult> {
    if (!existsSync(CODEX_HOME)) {
      return {
        tool: "codex",
        agents: [],
        health: "degraded",
        note: "~/.codex not found; start ChatGPT/Codex or enable demo mode",
      };
    }

    const files = await walkFiles(CODEX_HOME);
    const agents: RawAgent[] = [];
    for (const file of files.slice(-30)) {
      const agent = await parseFile(file);
      if (agent) agents.push(agent);
    }

    // Dedupe by title, keep newest
    const byTitle = new Map<string, RawAgent>();
    for (const a of agents.sort((x, y) => y.updatedAt - x.updatedAt)) {
      if (!byTitle.has(a.title)) byTitle.set(a.title, a);
    }
    const unique = [...byTitle.values()].slice(0, 8);

    return {
      tool: "codex",
      agents: unique,
      health: unique.length ? "ok" : "degraded",
      note: unique.length
        ? undefined
        : "No Codex session signals yet; commands still work",
    };
  },
};
