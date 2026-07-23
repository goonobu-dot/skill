/**
 * Vibe Deck Status — Ulanzi Studio JavaScript plugin
 * Handshake/protocol aligned with official Ulanzi Discord plugin.
 */
const fs = require("fs");
const http = require("http");
const { spawn } = require("child_process");
const WebSocket = require("ws");

const PLUGIN_UUID = "com.vibe.deck.status";
const BRIDGE = process.env.VIBE_DECK_BRIDGE || "http://127.0.0.1:17823";
const LOG = `${process.env.HOME}/Library/Logs/vibe-deck-plugin.log`;

const STATE_INDEX = {
  idle: 0,
  thinking: 1,
  done: 2,
  needs_input: 3,
  error: 4,
  empty: 5,
};

const STATE_LABEL = {
  idle: "白",
  thinking: "青",
  done: "緑",
  needs_input: "橙",
  error: "赤",
  empty: "灰",
};

function log(...args) {
  const line = `[${new Date().toISOString()}] ${args
    .map((a) => (typeof a === "string" ? a : JSON.stringify(a)))
    .join(" ")}\n`;
  try {
    fs.appendFileSync(LOG, line);
  } catch {
    // ignore
  }
}

class UlanziClient {
  constructor(uuid) {
    this.uuid = uuid;
    this.ws = null;
    this.handlers = new Map();
  }

  on(evt, fn) {
    if (!this.handlers.has(evt)) this.handlers.set(evt, new Set());
    this.handlers.get(evt).add(fn);
  }

  emit(evt, payload) {
    for (const fn of this.handlers.get(evt) || []) {
      try {
        fn(payload);
      } catch (err) {
        log("handler error", String(err));
      }
    }
  }

  connect(host, port) {
    const url = `ws://${host}:${port}`;
    log("connecting", url);
    this.ws = new WebSocket(url);
    this.ws.on("open", () => {
      this.ws.send(
        JSON.stringify({ uuid: this.uuid, cmd: "connected", code: 0 }),
      );
      log("sent connected handshake");
      this.emit("open");
    });
    this.ws.on("message", (data) => {
      let msg;
      try {
        msg = JSON.parse(String(data));
      } catch {
        return;
      }
      const cmd = msg.cmd || msg.event || msg.type;
      if (cmd && cmd !== "state") log("message", msg);
      if (cmd) this.emit(cmd, msg);
      if (msg.uuid && cmd) this.emit(`${msg.uuid}.${cmd}`, msg);
    });
    this.ws.on("close", () => log("ws close"));
    this.ws.on("error", (err) => log("ws error", String(err)));
  }

  send(uuid, cmd, extra = {}) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    this.ws.send(JSON.stringify({ uuid, cmd, ...extra }));
  }

  setState(statelist) {
    this.send(this.uuid, "state", { param: { statelist } });
  }
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http
      .get(url, (res) => {
        let body = "";
        res.on("data", (c) => (body += c));
        res.on("end", () => {
          try {
            resolve(JSON.parse(body));
          } catch (e) {
            reject(e);
          }
        });
      })
      .on("error", reject);
  });
}

function activateApp(name) {
  spawn("osascript", ["-e", `tell application "${name}" to activate`], {
    stdio: "ignore",
    detached: true,
  }).unref();
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

const client = new UlanziClient(PLUGIN_UUID);
/** @type {Map<string, any>} */
const keys = new Map();
/** @type {Map<string, number>} */
const lastState = new Map();

function remember(msg) {
  if (msg.cmd && msg.cmd !== "add") return;
  const param = msg.param || {};
  const slot = Number(param.slot || param.Slot || 1);
  const tool = String(param.tool || param.Tool || "cursor").toLowerCase();
  const actionid = msg.actionid || msg.ActionID || param.actionid;
  const key = msg.key || param.key;
  const uuid = msg.uuid || PLUGIN_UUID;
  if (!actionid) return;
  // Only track agent slots for color painting
  if (uuid !== "com.vibe.deck.status.agent") return;
  keys.set(String(actionid), {
    slot: Math.min(8, Math.max(1, slot || 1)),
    tool: ["claude", "codex", "cursor"].includes(tool) ? tool : "cursor",
    key,
    actionid,
    uuid,
    device: msg.device,
    controller: msg.controller,
  });
  log("remember", actionid, key, slot, tool);
}

function item(meta, state) {
  return {
    actionid: meta.actionid,
    key: meta.key,
    uuid: meta.uuid,
    controller: meta.controller || "Keypad",
    device: meta.device || "D200X",
    type: 0,
    state,
  };
}

async function paint() {
  if (!keys.size) return;
  const tools = new Set([...keys.values()].map((k) => k.tool));
  for (const tool of tools) {
    let status;
    try {
      status = await fetchJson(
        `${BRIDGE}/status?tool=${encodeURIComponent(tool)}`,
      );
    } catch (err) {
      log("bridge fetch failed", String(err));
      continue;
    }
    const agents = status.agents || [];
    const targets = [];
    for (const meta of keys.values()) {
      if (meta.tool !== tool) continue;
      const agent = agents.find((a) => a.slot === meta.slot) || {
        state: "empty",
      };
      const state = STATE_INDEX[agent.state] ?? STATE_INDEX.empty;
      targets.push({ meta, state, label: STATE_LABEL[agent.state] || "?" });
    }
    if (!targets.length) continue;

    const fingerprint = targets.map((t) => `${t.meta.key}:${t.state}`).join(",");
    const prev = lastState.get(tool);
    if (prev === fingerprint) continue;
    lastState.set(tool, fingerprint);

    // Force LCD refresh: flash empty, then apply target states.
    client.setState(targets.map((t) => item(t.meta, STATE_INDEX.empty)));
    await sleep(80);
    client.setState(targets.map((t) => item(t.meta, t.state)));
    log("painted", tool, fingerprint, targets.map((t) => t.label).join(""));
  }
}

client.on("add", remember);
client.on("run", async (msg) => {
  const action = msg.action || msg.Action || msg.uuid || "";
  const param = msg.param || {};
  if (String(action).includes("refresh")) {
    lastState.clear();
    await paint();
    return;
  }
  if (String(action).includes("agent") || String(action).includes("focus")) {
    const tool = String(param.tool || "cursor");
    const app =
      tool === "claude" ? "Claude" : tool === "codex" ? "ChatGPT" : "Cursor";
    activateApp(app);
  }
});

const host = process.argv[2] || "127.0.0.1";
const port = process.argv[3] || "2394";
log("boot", { host, port, argv: process.argv.slice(2) });
client.connect(host, port);
setInterval(() => {
  paint().catch((e) => log("paint error", String(e)));
}, 500);
