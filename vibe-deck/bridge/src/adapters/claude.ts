import { spawn } from "node:child_process";
import type { AgentState, RawAgent } from "../types.js";
import type { AdapterResult, ToolAdapter } from "./types.js";

function run(cmd: string, args: string[], timeoutMs = 2500): Promise<string> {
  return new Promise((resolve) => {
    const child = spawn(cmd, args, { stdio: ["ignore", "pipe", "pipe"] });
    let out = "";
    const timer = setTimeout(() => {
      child.kill("SIGKILL");
      resolve(out);
    }, timeoutMs);
    child.stdout.on("data", (d) => {
      out += String(d);
    });
    child.on("close", () => {
      clearTimeout(timer);
      resolve(out);
    });
    child.on("error", () => {
      clearTimeout(timer);
      resolve("");
    });
  });
}

function mapClaudeState(raw: unknown): Exclude<AgentState, "empty"> {
  const s = String(raw ?? "").toLowerCase();
  if (/(error|fail)/.test(s)) return "error";
  if (/(need|input|approval|waiting|interrupt|question)/.test(s)) {
    return "needs_input";
  }
  if (/(run|active|busy|thinking|working|progress)/.test(s)) return "thinking";
  if (/(done|complete|finished|idle_complete)/.test(s)) return "done";
  return "idle";
}

function normalizeAgents(payload: unknown): RawAgent[] {
  const now = Date.now();
  const list = Array.isArray(payload)
    ? payload
    : Array.isArray((payload as { sessions?: unknown })?.sessions)
      ? ((payload as { sessions: unknown[] }).sessions)
      : Array.isArray((payload as { agents?: unknown })?.agents)
        ? ((payload as { agents: unknown[] }).agents)
        : [];

  return list.slice(0, 12).map((item, idx) => {
    const obj = (item ?? {}) as Record<string, unknown>;
    const id = String(obj.id || obj.sessionId || obj.name || `claude-${idx}`);
    const title = String(obj.title || obj.name || obj.cwd || id).slice(0, 40);
    const state = mapClaudeState(obj.status || obj.state || obj.phase);
    return {
      id,
      title,
      state,
      updatedAt: now,
      focusAction: { kind: "activate_app", payload: "Claude" },
    };
  });
}

export const claudeAdapter: ToolAdapter = {
  tool: "claude",
  async collect(): Promise<AdapterResult> {
    const jsonOut = await run("claude", ["agents", "--json"]);
    if (jsonOut.trim()) {
      try {
        const parsed = JSON.parse(jsonOut);
        const agents = normalizeAgents(parsed);
        return {
          tool: "claude",
          agents,
          health: agents.length ? "ok" : "degraded",
          note: agents.length
            ? undefined
            : "claude agents --json returned no sessions",
        };
      } catch {
        // fall through
      }
    }

    const daemon = await run("claude", ["daemon", "status"]);
    if (/running|pid|worker/i.test(daemon)) {
      return {
        tool: "claude",
        agents: [
          {
            id: "claude-daemon",
            title: "Claude daemon",
            state: "idle",
            updatedAt: Date.now(),
            focusAction: { kind: "activate_app", payload: "Claude" },
          },
        ],
        health: "degraded",
        note: "Daemon reachable but session list unavailable",
      };
    }

    return {
      tool: "claude",
      agents: [],
      health: "degraded",
      note: "Claude CLI/agents unavailable; open Claude.app for commands",
    };
  },
};
