/**
 * Vibe Deck Status — Ulanzi Studio JavaScript plugin
 * Protocol aligned with Ulanzi Discord plugin (ws host/port from argv).
 */
const { spawn } = require("child_process");
const http = require("http");
const WebSocket = require("ws");

const PLUGIN_UUID = "com.vibe.deck.status";
const BRIDGE = process.env.VIBE_DECK_BRIDGE || "http://127.0.0.1:17823";

const STATE_INDEX = {
  idle: 0,
  thinking: 1,
  done: 2,
  needs_input: 3,
  error: 4,
  empty: 5,
};

const EVENTS = {
  connected: "connected",
  add: "add",
  clear: "clear",
  setActive: "setactive",
  run: "run",
  keyDown: "keydown",
  keyUp: "keyup",
  setState: "state",
  showToast: "toast",
};

class Bus {
  constructor() {
    this.handlers = new Map();
  }
  on(evt, fn) {
    if (!this.handlers.has(evt)) this.handlers.set(evt, new Set());
    this.handlers.get(evt).add(fn);
    return this;
  }
  emit(evt, payload) {
    for (const fn of this.handlers.get(evt) || []) fn(payload);
  }
}

class UlanziClient extends Bus {
  constructor() {
    super();
    this.ws = null;
    this.uuid = PLUGIN_UUID;
  }

  connect(host, port, uuid) {
    this.host = host;
    this.port = port;
    this.uuid = uuid || PLUGIN_UUID;
    const url = `ws://${host}:${port}`;
    this.ws = new WebSocket(url);
    this.ws.on("open", () => {
      this.ws.send(JSON.stringify({ uuid: this.uuid }));
      this.emit("open");
    });
    this.ws.on("message", (data) => {
      try {
        const msg = JSON.parse(String(data));
        const cmd = msg.cmd || msg.event || msg.type;
        if (cmd) this.emit(cmd, msg);
        if (msg.uuid && msg.cmd) this.emit(`${msg.uuid}.${msg.cmd}`, msg);
      } catch {
        // ignore
      }
    });
    this.ws.on("close", () => this.emit("close"));
    this.ws.on("error", () => {});
  }

  send(uuid, cmd, payload = {}) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    this.ws.send(JSON.stringify({ uuid, cmd, ...payload }));
  }

  setState(param) {
    this.send(this.uuid, EVENTS.setState, { param });
  }

  toast(message) {
    this.send(this.uuid, EVENTS.showToast, { param: { message } });
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
  spawn("osascript", [
    "-e",
    `tell application "${name}" to activate`,
  ], { stdio: "ignore", detached: true }).unref();
}

const client = new UlanziClient();
const keys = new Map(); // actionid -> { slot, tool, key, actionid, uuid }

async function paint() {
  const byTool = {};
  for (const meta of keys.values()) {
    byTool[meta.tool] = byTool[meta.tool] || new Set();
    byTool[meta.tool].add(meta.slot);
  }

  for (const tool of Object.keys(byTool)) {
    let status;
    try {
      status = await fetchJson(`${BRIDGE}/status?tool=${tool}`);
    } catch {
      continue;
    }
    const agents = status.agents || [];
    for (const meta of keys.values()) {
      if (meta.tool !== tool) continue;
      const agent = agents.find((a) => a.slot === meta.slot) || {
        state: "empty",
        title: `Slot ${meta.slot}`,
      };
      const state = STATE_INDEX[agent.state] ?? STATE_INDEX.empty;
      client.setState({
        statelist: [
          {
            uuid: meta.uuid,
            key: meta.key,
            actionid: meta.actionid,
            type: 0,
            state,
          },
        ],
      });
    }
  }
}

function remember(msg) {
  const param = msg.param || {};
  const slot = Number(param.slot || param.Slot || 1);
  const tool = String(param.tool || param.Tool || "codex").toLowerCase();
  const actionid = msg.actionid || msg.ActionID || param.actionid;
  const key = msg.key || param.key;
  const uuid = msg.uuid || PLUGIN_UUID;
  if (!actionid) return;
  keys.set(actionid, {
    slot: Math.min(8, Math.max(1, slot || 1)),
    tool: ["claude", "codex", "cursor"].includes(tool) ? tool : "codex",
    key,
    actionid,
    uuid,
  });
}

client.on(`${PLUGIN_UUID}.${EVENTS.add}`, (msg) => {
  remember(msg);
  paint();
});
client.on(`${PLUGIN_UUID}.${EVENTS.clear}`, (msg) => {
  const actionid = msg.actionid || (msg.param && msg.param.actionid);
  if (actionid) keys.delete(actionid);
});
client.on(`${PLUGIN_UUID}.${EVENTS.run}`, async (msg) => {
  const action = msg.action || msg.Action || "";
  const param = msg.param || {};
  if (action.endsWith(".refresh")) {
    await paint();
    client.toast("Vibe Deck refreshed");
    return;
  }
  if (action.endsWith(".focus") || action.endsWith(".agent")) {
    const tool = String(param.tool || "codex");
    const app =
      tool === "claude" ? "Claude" : tool === "cursor" ? "Cursor" : "ChatGPT";
    activateApp(app);
  }
});

const host = process.argv[2] || "127.0.0.1";
const port = process.argv[3] || "2394";
client.connect(host, port, PLUGIN_UUID);

setInterval(() => {
  paint().catch(() => {});
}, 1000);

console.log(`[vibe-deck-plugin] connected target ws://${host}:${port}`);
