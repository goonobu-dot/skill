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

function log(...args) {
  const line = `[${new Date().toISOString()}] ${args
    .map((a) => (typeof a === "string" ? a : JSON.stringify(a)))
    .join(" ")}\n`;
  try {
    fs.appendFileSync(LOG, line);
  } catch {
    // ignore
  }
  console.log(...args);
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
      // Required handshake (same as Discord plugin)
      const hello = { uuid: this.uuid, cmd: "connected", code: 0 };
      this.ws.send(JSON.stringify(hello));
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
      log("message", msg);
      if (cmd) this.emit(cmd, msg);
      if (msg.uuid && cmd) this.emit(`${msg.uuid}.${cmd}`, msg);
    });
    this.ws.on("close", () => log("ws close"));
    this.ws.on("error", (err) => log("ws error", String(err)));
  }

  send(uuid, cmd, extra = {}) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    const payload = { uuid, cmd, ...extra };
    this.ws.send(JSON.stringify(payload));
    log("send", payload);
  }

  setState(param) {
    this.send(this.uuid, "state", { param });
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

const client = new UlanziClient(PLUGIN_UUID);
/** @type {Map<string, any>} */
const keys = new Map();

function remember(msg) {
  const param = msg.param || {};
  const slot = Number(param.slot || param.Slot || 1);
  const tool = String(param.tool || param.Tool || "cursor").toLowerCase();
  const actionid = msg.actionid || msg.ActionID || param.actionid;
  const key = msg.key || param.key;
  const uuid = msg.uuid || PLUGIN_UUID;
  if (!actionid && key == null) {
    log("remember skip (no actionid/key)", msg);
    return;
  }
  const id = String(actionid || `${uuid}:${key}`);
  keys.set(id, {
    slot: Math.min(8, Math.max(1, slot || 1)),
    tool: ["claude", "codex", "cursor"].includes(tool) ? tool : "cursor",
    key,
    actionid,
    uuid,
    // keep original fields for setState spread compatibility
    raw: msg,
  });
  log("remember", id, keys.get(id));
}

async function paint() {
  if (!keys.size) {
    // Still try to paint nothing; log once in a while
    return;
  }
  const tools = new Set([...keys.values()].map((k) => k.tool));
  for (const tool of tools) {
    let status;
    try {
      status = await fetchJson(`${BRIDGE}/status?tool=${encodeURIComponent(tool)}`);
    } catch (err) {
      log("bridge fetch failed", String(err));
      continue;
    }
    const agents = status.agents || [];
    const list = [];
    for (const meta of keys.values()) {
      if (meta.tool !== tool) continue;
      const agent = agents.find((a) => a.slot === meta.slot) || {
        state: "empty",
      };
      const state = STATE_INDEX[agent.state] ?? STATE_INDEX.empty;
      const base = {
        uuid: meta.uuid,
        key: meta.key,
        actionid: meta.actionid,
        type: 0,
        state,
      };
      // include any identifying fields from add event
      const raw = meta.raw || {};
      list.push({
        ...raw,
        param: undefined,
        cmd: undefined,
        ...base,
      });
    }
    if (list.length) {
      client.setState({ statelist: list });
      log(
        "painted",
        tool,
        list.map((x) => `${x.key}:${x.state}`).join(","),
      );
    }
  }
}

client.on("add", remember);
client.on(`${PLUGIN_UUID}.add`, remember);
client.on("run", async (msg) => {
  const action = msg.action || msg.Action || "";
  const param = msg.param || {};
  log("run", action, param);
  if (String(action).endsWith(".refresh")) {
    await paint();
    return;
  }
  if (String(action).endsWith(".focus") || String(action).endsWith(".agent")) {
    const tool = String(param.tool || "cursor");
    const app =
      tool === "claude" ? "Claude" : tool === "codex" ? "ChatGPT" : "Cursor";
    activateApp(app);
  }
});
client.on(`${PLUGIN_UUID}.run`, (msg) => client.emit("run", msg));

const host = process.argv[2] || "127.0.0.1";
const port = process.argv[3] || "2394";
log("boot", { host, port, argv: process.argv.slice(2), bridge: BRIDGE });
client.connect(host, port);

setInterval(() => {
  paint().catch((e) => log("paint error", String(e)));
}, 1000);
