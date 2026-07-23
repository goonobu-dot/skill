import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { collectTool } from "../adapters/index.js";
import type { StatusPayload, ToolId } from "../types.js";
import { demoAgents } from "./demo.js";
import { assignSlots } from "./slots.js";

const TOOLS = new Set<ToolId>(["claude", "codex", "cursor"]);

function sendJson(res: ServerResponse, code: number, body: unknown): void {
  const data = JSON.stringify(body, null, 2);
  res.writeHead(code, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "no-store",
  });
  res.end(data);
}

function parseTool(url: URL): ToolId {
  const tool = (url.searchParams.get("tool") || "codex") as ToolId;
  return TOOLS.has(tool) ? tool : "codex";
}

export async function buildStatus(tool: ToolId): Promise<StatusPayload> {
  const demo = process.env.VIBE_DECK_DEMO === "1";
  const result = demo ? demoAgents(tool) : await collectTool(tool);
  return {
    tool,
    bridge: result.health,
    // Demo keeps slot order so colors visibly cycle on each key.
    agents: assignSlots(result.agents, undefined, { prioritize: !demo }),
    updatedAt: Date.now(),
    note: result.note,
  };
}

export function startServer(port: number): ReturnType<typeof createServer> {
  const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
    try {
      const url = new URL(req.url || "/", `http://${req.headers.host || "127.0.0.1"}`);
      if (req.method === "GET" && url.pathname === "/health") {
        sendJson(res, 200, { ok: true, demo: process.env.VIBE_DECK_DEMO === "1" });
        return;
      }
      if (req.method === "GET" && url.pathname === "/status") {
        const tool = parseTool(url);
        sendJson(res, 200, await buildStatus(tool));
        return;
      }
      if (req.method === "GET" && url.pathname === "/") {
        sendJson(res, 200, {
          name: "vibe-deck-bridge",
          endpoints: ["/health", "/status?tool=codex|claude|cursor"],
        });
        return;
      }
      sendJson(res, 404, { error: "not_found" });
    } catch (err) {
      sendJson(res, 500, {
        error: "internal_error",
        message: err instanceof Error ? err.message : String(err),
      });
    }
  });

  server.listen(port, "127.0.0.1");
  return server;
}
