import type { AgentState, RawAgent, ToolId } from "../types.js";
import type { AdapterResult } from "../adapters/types.js";

const CYCLE: Exclude<AgentState, "empty">[] = [
  "idle",
  "thinking",
  "needs_input",
  "done",
  "error",
  "thinking",
];

const APP: Record<ToolId, string> = {
  claude: "Claude",
  codex: "ChatGPT",
  cursor: "Cursor",
};

export function demoAgents(tool: ToolId, now = Date.now()): AdapterResult {
  const tick = Math.floor(now / 2000);
  const agents: RawAgent[] = Array.from({ length: 6 }, (_, i) => {
    const state = CYCLE[(tick + i) % CYCLE.length]!;
    return {
      id: `${tool}-demo-${i + 1}`,
      title: `${tool.toUpperCase()} Agent ${i + 1}`,
      state,
      updatedAt: now,
      focusAction: { kind: "activate_app", payload: APP[tool] },
    };
  });

  return {
    tool,
    agents,
    health: "ok",
    note: "DEMO MODE — colors cycle every 2s",
  };
}
