#!/usr/bin/env node
import { mkdirSync, writeFileSync, cpSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const outRoot = join(root, "presets");

const PROMPTS = [
  ["Design", "この機能の要件を整理し、簡潔な設計案を出してください。"],
  ["Implement", "上記の設計に沿って実装してください。テスト可能な単位で進めてください。"],
  ["Review", "変更差分をレビューし、バグ・リスク・改善点を指摘してください。"],
  ["Fix", "このエラーを再現手順つきで分析し、最小修正で直してください。"],
  ["Test", "この変更のユニット／統合テストを追加してください。"],
  ["Explain", "このコードの動きを初心者にも分かるように説明してください。"],
  ["Commit", "変更内容から良いコミットメッセージ案を3つ出してください。"],
  ["Summary", "今の作業内容を3行で要約してください。"],
];

const TOOLS = [
  {
    id: "codex",
    name: "Vibe · Codex",
    app: "ChatGPT",
    hotkeys: {
      accept: "⌘ ⌅",
      reject: "⌘ ⌫",
      newChat: "⌘ N",
      stop: "⌘ .",
      dictation: "⌃ ⇧ D",
      effortLeft: "⌘ [",
      effortRight: "⌘ ]",
      scrollUp: "上スクロール",
      scrollDown: "下スクロール",
    },
  },
  {
    id: "claude",
    name: "Vibe · Claude",
    app: "Claude",
    hotkeys: {
      accept: "⌘ ⌅",
      reject: "⎋",
      newChat: "⌘ N",
      stop: "⎋",
      dictation: "⇪",
      effortLeft: "⌘ ⇧ E",
      effortRight: "⌘ ⇧ M",
      scrollUp: "上スクロール",
      scrollDown: "下スクロール",
    },
  },
  {
    id: "cursor",
    name: "Vibe · Cursor",
    app: "Cursor",
    hotkeys: {
      accept: "⌘ ⌅",
      reject: "⌘ ⌫",
      newChat: "⌘ L",
      stop: "⌘ ⇧ ⌫",
      dictation: "Fn Fn",
      effortLeft: "⌘ [",
      effortRight: "⌘ ]",
      scrollUp: "上スクロール",
      scrollDown: "下スクロール",
    },
  },
];

function hotkeyAction(name, hotkey, iconRel) {
  return {
    Action: "com.ulanzi.ulanzideck.system.hotkey",
    ActionID: randomUUID(),
    ActionParam: {
      Action: "com.ulanzi.ulanzideck.system.hotkey",
      Hotkeys: [{ Hotkey: hotkey }],
      Hotkey: hotkey,
    },
    LinkedTitle: true,
    Name: name,
    Plugin: { Name: "System", UUID: "com.ulanzi.deck.system", Version: "1.0" },
    State: 0,
    ViewParam: [{ Icon: "", Text: name, IconRel: iconRel || "" }],
  };
}

function textAction(name, text) {
  return {
    Action: "com.ulanzi.ulanzideck.system.text",
    ActionID: randomUUID(),
    ActionParam: {
      Action: "com.ulanzi.ulanzideck.system.text",
      Text: text,
    },
    LinkedTitle: true,
    Name: name,
    Plugin: { Name: "System", UUID: "com.ulanzi.deck.system", Version: "1.0" },
    State: 0,
    ViewParam: [{ Icon: "", Text: name }],
  };
}

function openAppAction(name, appPath) {
  return {
    Action: "com.ulanzi.ulanzideck.system.open",
    ActionID: randomUUID(),
    ActionParam: {
      Action: "com.ulanzi.ulanzideck.system.open",
      Path: appPath,
    },
    LinkedTitle: true,
    Name: name,
    Plugin: { Name: "System", UUID: "com.ulanzi.deck.system", Version: "1.0" },
    State: 0,
    ViewParam: [{ Icon: "", Text: name }],
  };
}

function agentAction(slot, tool) {
  return {
    Action: "com.vibe.deck.status.agent",
    ActionID: randomUUID(),
    ActionParam: { slot, tool },
    LinkedTitle: true,
    Name: `A${slot}`,
    Plugin: {
      Name: "Vibe Deck Status",
      UUID: "com.vibe.deck.status",
      Version: "1.0.0",
    },
    State: 5,
    ViewParam: [{ Icon: "", Text: `A${slot}` }],
  };
}

function buildPreset(tool) {
  const profileId = randomUUID();
  const pageControl = randomUUID();
  const pagePrompts = randomUUID();
  const folderId = `${profileId}.ulanziProfile`;
  const base = join(outRoot, tool.name);

  mkdirSync(join(base, "Profiles", pageControl, "Images"), { recursive: true });
  mkdirSync(join(base, "Profiles", pagePrompts, "Images"), { recursive: true });

  const iconsDir = join(root, "assets/icons");
  if (existsSync(iconsDir)) {
    cpSync(iconsDir, join(base, "Profiles", pageControl, "Images"), {
      recursive: true,
    });
  }

  const controlActions = {};
  // Agent slots 1-8 on a 4x2 grid: rows 0-1, cols 0-3
  let slot = 1;
  for (let y = 0; y <= 1; y++) {
    for (let x = 0; x <= 3; x++) {
      controlActions[`${x}_${y}`] = agentAction(slot, tool.id);
      slot += 1;
    }
  }

  // Command row y=2
  controlActions["0_2"] = hotkeyAction("Accept", tool.hotkeys.accept);
  controlActions["1_2"] = hotkeyAction("Reject", tool.hotkeys.reject);
  controlActions["2_2"] = hotkeyAction("New", tool.hotkeys.newChat);
  controlActions["3_2"] = hotkeyAction("Stop", tool.hotkeys.stop);

  // Hub + dictation y=3
  controlActions["0_3"] = openAppAction("Claude", "/Applications/Claude.app");
  controlActions["1_3"] = openAppAction("Codex", "/Applications/ChatGPT.app");
  controlActions["2_3"] = openAppAction("Cursor", "/Applications/Cursor.app");
  controlActions["3_3"] = hotkeyAction("Mic", tool.hotkeys.dictation);

  const encoders = {
    "0_0": {
      Action: "com.ulanzi.ulanzideck.system.hotkey",
      ActionID: randomUUID(),
      ActionParam: {
        Action: "com.ulanzi.ulanzideck.system.hotkey",
        knob_rotate_left: { Hotkey: tool.hotkeys.effortLeft },
        knob_rotate_right: { Hotkey: tool.hotkeys.effortRight },
        knob_press: { Hotkey: tool.hotkeys.newChat },
      },
      LinkedTitle: true,
      Name: "Effort",
      State: 0,
      ViewParam: [{ Text: "Effort" }],
    },
    "1_0": {
      Action: "com.vibe.deck.status.refresh",
      ActionID: randomUUID(),
      ActionParam: { tool: tool.id },
      LinkedTitle: true,
      Name: "Refresh",
      Plugin: {
        Name: "Vibe Deck Status",
        UUID: "com.vibe.deck.status",
        Version: "1.0.0",
      },
      State: 0,
      ViewParam: [{ Text: "Refresh" }],
    },
    "2_0": {
      Action: "com.ulanzi.ulanzideck.system.hotkey",
      ActionID: randomUUID(),
      ActionParam: {
        Action: "com.ulanzi.ulanzideck.system.hotkey",
        knob_rotate_left: { Hotkey: tool.hotkeys.scrollUp },
        knob_rotate_right: { Hotkey: tool.hotkeys.scrollDown },
      },
      LinkedTitle: true,
      Name: "Scroll",
      State: 0,
      ViewParam: [{ Text: "Scroll" }],
    },
  };

  writeFileSync(
    join(base, "manifest.json"),
    JSON.stringify(
      {
        Device: { Model: "D200X", UUID: "" },
        Name: tool.name,
        Version: "2.0",
        Pages: {
          Current: pageControl,
          Pages: [pageControl, pagePrompts],
        },
      },
      null,
      2,
    ),
  );

  writeFileSync(
    join(base, "Profiles", pageControl, "manifest.json"),
    JSON.stringify(
      {
        Name: "Control",
        Controllers: [
          { Type: "Encoder", Actions: encoders },
          { Type: "Keypad", Actions: controlActions },
        ],
      },
      null,
      2,
    ),
  );

  const promptActions = {};
  PROMPTS.forEach(([name, text], i) => {
    const x = i % 4;
    const y = Math.floor(i / 4);
    promptActions[`${x}_${y}`] = textAction(name, text);
  });
  promptActions["0_3"] = openAppAction(tool.app, `/Applications/${tool.app === "ChatGPT" ? "ChatGPT" : tool.app}.app`);

  writeFileSync(
    join(base, "Profiles", pagePrompts, "manifest.json"),
    JSON.stringify(
      {
        Name: "Prompt Pack",
        Controllers: [
          { Type: "Encoder", Actions: {} },
          { Type: "Keypad", Actions: promptActions },
        ],
      },
      null,
      2,
    ),
  );

  // Importable wrapper name used by install script
  writeFileSync(
    join(base, "README.txt"),
    `Import this folder as a D200X profile in Ulanzi Studio, or run scripts/install.sh\nTool=${tool.id}\n`,
  );

  console.log("built preset", tool.name, "->", base);
  return folderId;
}

mkdirSync(outRoot, { recursive: true });
for (const tool of TOOLS) buildPreset(tool);
console.log("done");
