/**
 * Vibe Deck Status — Ulanzi Studio JavaScript plugin
 * Handshake/protocol aligned with official Ulanzi Discord plugin.
 */
const fs = require("fs");
const http = require("http");
const path = require("path");
const { spawn } = require("child_process");
const WebSocket = require("ws");

const PLUGIN_UUID = "com.vibe.deck.status";
const BRIDGE = process.env.VIBE_DECK_BRIDGE || "http://127.0.0.1:17823";
const LOG = `${process.env.HOME}/Library/Logs/vibe-deck-plugin.log`;
const PROFILES_DIR = path.join(
  process.env.HOME,
  "Library/Application Support/Ulanzi/UlanziDeck/ProfilesV2",
);
const SETTING_PATH = path.join(
  process.env.HOME,
  "Library/Application Support/Ulanzi/UlanziDeck/config/setting.json",
);
const RING_OVERRIDE = path.join(
  process.env.HOME,
  "Library/Application Support/Ulanzi/UlanziDeck/Plugins/com.vibe.deck.status.ulanziPlugin/profile-ring.json",
);
const PAINT_MS = 150;

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
    const req = http.get(url, (res) => {
      let body = "";
      res.on("data", (c) => (body += c));
      res.on("end", () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on("error", reject);
    req.setTimeout(2000, () => {
      req.destroy(new Error("timeout"));
    });
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

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

function listProfiles() {
  const override = readJson(RING_OVERRIDE, null);
  if (Array.isArray(override?.names) && override.names.length) {
    return override.names.map((name) => ({ name, uuid: null }));
  }
  if (!fs.existsSync(PROFILES_DIR)) return [];
  const out = [];
  for (const dir of fs.readdirSync(PROFILES_DIR)) {
    if (!dir.endsWith(".ulanziProfile")) continue;
    const manifest = path.join(PROFILES_DIR, dir, "manifest.json");
    const j = readJson(manifest, null);
    if (!j?.Name) continue;
    // Prefer D200X profiles; keep unknowns too so ring matches Studio list.
    out.push({
      name: j.Name,
      uuid: dir.replace(/\.ulanziProfile$/, ""),
      model: j.Device?.Model || "",
    });
  }
  out.sort((a, b) => a.name.localeCompare(b.name, "ja"));
  return out;
}

function currentProfileName() {
  const setting = readJson(SETTING_PATH, {});
  return String(setting.CurrentProfile || "");
}

function writeCurrentProfile(name) {
  const setting = readJson(SETTING_PATH, {});
  setting.CurrentProfile = name;
  fs.writeFileSync(SETTING_PATH, JSON.stringify(setting, null, "\t") + "\n");
  // Also update setting_source device entry when present
  const srcPath = SETTING_PATH.replace("setting.json", "setting_source.json");
  const src = readJson(srcPath, null);
  if (src && Array.isArray(src.Devices)) {
    for (const d of src.Devices) {
      if (d.DeviceType === "D200X" || d.CurrentDevice) {
        d.CurrentProfile = name;
      }
    }
    fs.writeFileSync(srcPath, JSON.stringify(src));
  }
}

function switchProfile(direction) {
  const profiles = listProfiles();
  if (!profiles.length) {
    log("profile ring empty");
    return;
  }
  const cur = currentProfileName();
  let idx = profiles.findIndex((p) => p.name === cur);
  if (idx < 0) idx = 0;
  const next =
    profiles[
      (idx + (direction === "prev" ? -1 : 1) + profiles.length) % profiles.length
    ];
  if (!next || next.name === cur) {
    log("profile already", cur);
    return;
  }
  writeCurrentProfile(next.name);

  // Stream Deck–style + Ulanzi variants (host may honor one of these).
  const payloads = [
    { event: "switchToProfile", profile: next.name, profileName: next.name },
    {
      cmd: "switchToProfile",
      param: { profileName: next.name, ProfileName: next.name, ProfileUUID: next.uuid },
    },
    {
      cmd: "switch",
      uuid: "com.ulanzi.ulanzideck.page.switch",
      param: { ProfileUUID: next.uuid, ProfileName: next.name },
    },
  ];
  for (const p of payloads) {
    if (client.ws && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify(p));
    }
  }

  // UI fallback: select profile from Studio's profile popup (menu bar / toolbar).
  const script = `
    set targetName to ${JSON.stringify(next.name)}
    try
      tell application "Ulanzi Studio" to activate
      delay 0.15
      tell application "System Events"
        tell process "Ulanzi Studio"
          set frontmost to true
          -- Click common profile/menu controls, then choose by name
          try
            click menu bar item 1 of menu bar 1
          end try
          delay 0.05
          try
            click menu item targetName of menu 1 of menu bar item 1 of menu bar 1
          end try
          -- Also try popup buttons in the main window
          try
            set wins to windows
            repeat with w in wins
              try
                set pbs to pop up buttons of w
                repeat with pb in pbs
                  try
                    click pb
                    delay 0.08
                    click menu item targetName of menu 1 of pb
                    return
                  end try
                end repeat
              end try
            end repeat
          end try
        end tell
      end tell
    end try
  `;
  spawn("osascript", ["-e", script], {
    stdio: "ignore",
    detached: true,
  }).unref();

  log("profile switch", direction, cur, "->", next.name, `(${profiles.length})`);
}

function findProfileDirByName(name) {
  if (!fs.existsSync(PROFILES_DIR)) return null;
  for (const dir of fs.readdirSync(PROFILES_DIR)) {
    if (!dir.endsWith(".ulanziProfile")) continue;
    const manifest = path.join(PROFILES_DIR, dir, "manifest.json");
    const j = readJson(manifest, null);
    if (j?.Name === name) return path.join(PROFILES_DIR, dir);
  }
  return null;
}

function requestPage(direction) {
  const name = currentProfileName();
  const dir = findProfileDirByName(name);
  if (dir) {
    const manifestPath = path.join(dir, "manifest.json");
    const root = readJson(manifestPath, null);
    const pages = root?.Pages?.Pages || [];
    if (pages.length >= 2) {
      let idx = pages.indexOf(root.Pages.Current);
      if (idx < 0) idx = 0;
      const nextIdx =
        (idx + (direction === "prev" ? -1 : 1) + pages.length) % pages.length;
      root.Pages.Current = pages[nextIdx];
      fs.writeFileSync(manifestPath, JSON.stringify(root, null, 2) + "\n");
      log("page file switch", name, idx, "->", nextIdx, pages[nextIdx]);
    }
  }

  if (client.ws && client.ws.readyState === WebSocket.OPEN) {
    const uuid =
      direction === "prev"
        ? "com.ulanzi.ulanzideck.page.prev"
        : "com.ulanzi.ulanzideck.page.next";
    client.ws.send(JSON.stringify({ uuid, cmd: "run", param: {} }));
    client.ws.send(
      JSON.stringify({
        event: direction === "prev" ? "previousPage" : "nextPage",
      }),
    );
  }

  // Nudge Studio to reload current profile page
  const script = `
    try
      tell application "Ulanzi Studio" to activate
    end try
  `;
  spawn("osascript", ["-e", script], { stdio: "ignore", detached: true }).unref();
  log("page request", direction);
}

const client = new UlanziClient(PLUGIN_UUID);
/** @type {Map<string, any>} */
const keys = new Map();
/** @type {Map<string, number>} */
const lastKeyState = new Map();
let paintInFlight = false;
let needsEmptyFlash = true;

function remember(msg) {
  if (msg.cmd && msg.cmd !== "add") return;
  const param = msg.param || {};
  const slot = Number(param.slot || param.Slot || 1);
  const tool = String(param.tool || param.Tool || "cursor").toLowerCase();
  const actionid = msg.actionid || msg.ActionID || param.actionid;
  const key = msg.key || param.key;
  const uuid = msg.uuid || PLUGIN_UUID;
  if (!actionid) return;
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
  needsEmptyFlash = true;
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
  if (!keys.size || paintInFlight) return;
  paintInFlight = true;
  try {
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
      const changed = [];
      const labels = [];
      for (const meta of keys.values()) {
        if (meta.tool !== tool) continue;
        const agent = agents.find((a) => a.slot === meta.slot) || {
          state: "empty",
        };
        const state = STATE_INDEX[agent.state] ?? STATE_INDEX.empty;
        const prev = lastKeyState.get(meta.actionid);
        labels.push(STATE_LABEL[agent.state] || "?");
        if (prev !== state || needsEmptyFlash) {
          changed.push({ meta, state });
          lastKeyState.set(meta.actionid, state);
        }
      }
      if (!changed.length) continue;

      if (needsEmptyFlash) {
        client.setState(
          changed.map((t) => item(t.meta, STATE_INDEX.empty)),
        );
        await sleep(40);
        needsEmptyFlash = false;
      }
      client.setState(changed.map((t) => item(t.meta, t.state)));
      log(
        "painted",
        tool,
        `${changed.length}keys`,
        labels.join(""),
      );
    }
  } finally {
    paintInFlight = false;
  }
}

function handleNavAction(action, msg) {
  const a = String(action || "");
  const param = msg.param || {};
  const ticks = Number(param.ticks || param.Steps || param.steps || 1);
  const dir =
    param.direction ||
    param.Direction ||
    (ticks < 0 || param.pressed === false ? "left" : null);

  if (a.includes("profile.prev")) {
    switchProfile("prev");
    return true;
  }
  if (a.includes("profile.next")) {
    switchProfile("next");
    return true;
  }
  if (a.includes("page.prev")) {
    requestPage("prev");
    return true;
  }
  if (a.includes("page.next") && !a.includes("page.dial")) {
    requestPage("next");
    return true;
  }
  if (a.includes("page.dial") || a.includes("page")) {
    if (dir === "left" || ticks < 0) {
      requestPage("prev");
      return true;
    }
    if (dir === "right" || ticks > 0) {
      requestPage("next");
      return true;
    }
    // press cycles forward
    requestPage("next");
    return true;
  }
  return false;
}

client.on("add", remember);
client.on("run", async (msg) => {
  const action = msg.action || msg.Action || msg.uuid || "";
  if (handleNavAction(action, msg)) return;
  const param = msg.param || {};
  const a = String(action);
  if (a.includes("refresh")) {
    lastKeyState.clear();
    needsEmptyFlash = true;
    await paint();
    return;
  }
  if (a.includes("agent") || a.includes("focus")) {
    const tool = String(param.tool || "cursor");
    const app =
      tool === "claude" ? "Claude" : tool === "codex" ? "ChatGPT" : "Cursor";
    activateApp(app);
  }
});

for (const evt of [
  "dialRotate",
  "rotate",
  "knob_rotate",
  "dial-rotate",
  "encoder",
]) {
  client.on(evt, (msg) => {
    const action = msg.action || msg.Action || msg.uuid || "";
    const param = msg.param || msg.payload || {};
    const ticks = Number(param.ticks ?? param.Steps ?? param.steps ?? msg.ticks ?? 0);
    if (String(action).includes("page")) {
      requestPage(ticks < 0 || param.direction === "left" ? "prev" : "next");
      return;
    }
    if (String(action).includes("profile")) {
      switchProfile(ticks < 0 || param.direction === "left" ? "prev" : "next");
    }
  });
}

const host = process.argv[2] || "127.0.0.1";
const port = process.argv[3] || "2394";
log("boot", { host, port, argv: process.argv.slice(2), paintMs: PAINT_MS });
client.connect(host, port);
setInterval(() => {
  paint().catch((e) => log("paint error", String(e)));
}, PAINT_MS);
