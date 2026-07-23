#!/usr/bin/env node
/**
 * Wire all D200X profiles with:
 * - bottom 0_3 / 1_3 → profile.prev / profile.next
 * - dial 4_3 → page.dial (rotate = page prev/next)
 * - AI profiles: rename Claude, theme icons, skills page, page 3
 */
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
  copyFileSync,
  chmodSync,
} from "node:fs";
import { join, dirname } from "node:path";
import { homedir } from "node:os";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const PROFILES = join(
  homedir(),
  "Library/Application Support/Ulanzi/UlanziDeck/ProfilesV2",
);
const PLUGIN_SRC = join(ROOT, "plugin/com.vibe.deck.status.ulanziPlugin");
const PLUGIN_DST = join(
  homedir(),
  "Library/Application Support/Ulanzi/UlanziDeck/Plugins/com.vibe.deck.status.ulanziPlugin",
);
const THEMES = join(ROOT, "assets/themes");

const AI = {
  Codex_D200X: { tool: "codex", theme: "codex" },
  "Vibe · Cursor": { tool: "cursor", theme: "cursor" },
  "Vibe · Claude": { tool: "claude", theme: "claude", rename: "Vibe · Claude Code" },
  "Vibe · Claude Code": { tool: "claude", theme: "claude" },
};

const SKILL_KEYS = [
  { key: "0_0", id: "design", text: "Design", prompt: "Design this feature:" },
  { key: "1_0", id: "implement", text: "Implement", prompt: "Implement this:" },
  { key: "2_0", id: "review", text: "Review", prompt: "Review this code:" },
  { key: "3_0", id: "fix", text: "Fix", prompt: "Fix this bug:" },
  { key: "4_0", id: "test", text: "Test", prompt: "Write tests for:" },
  { key: "0_1", id: "explain", text: "Explain", prompt: "Explain this:" },
  { key: "1_1", id: "commit", text: "Commit", prompt: "Write a commit message for:" },
  { key: "2_1", id: "summary", text: "Summary", prompt: "Summarize the diff:" },
];

const TOOL_EXTRAS = {
  cursor: [
    { key: "3_1", id: "composer", text: "Composer", hotkey: "⌘  I" },
    { key: "4_1", id: "agent", text: "Agent", hotkey: "⌘  ." },
    { key: "0_2", id: "terminal", text: "Terminal", hotkey: "⌃  `" },
  ],
  codex: [
    { key: "3_1", id: "new", text: "New Chat", hotkey: "⌘  N" },
    { key: "4_1", id: "dictation", text: "Dictation", hotkey: "⌃  ⇧  D" },
    { key: "0_2", id: "model", text: "Model", hotkey: "⌘  /" },
  ],
  claude: [
    { key: "3_1", id: "new", text: "New", hotkey: "⌘  N" },
    { key: "4_1", id: "diff", text: "Diff", hotkey: "⇧  ⌘  D" },
    { key: "0_2", id: "stop", text: "Stop", hotkey: "⎋" },
  ],
};

function readJson(p) {
  return JSON.parse(readFileSync(p, "utf8"));
}

function writeJson(p, obj) {
  writeFileSync(p, JSON.stringify(obj, null, 2) + "\n");
}

function vibeAction(uuid, name, text) {
  return {
    Action: uuid,
    ActionID: randomUUID(),
    ActionParam: {},
    LinkedTitle: true,
    Name: name,
    Plugin: {
      Name: "Vibe Deck Status",
      UUID: "com.vibe.deck.status",
      Version: "1.1.0",
    },
    State: 0,
    ViewParam: [{ Icon: "", IconRel: "", Text: text }],
  };
}

function hotkeyAction(text, hotkey, iconAbs, iconRel) {
  return {
    Action: "com.ulanzi.ulanzideck.system.hotkey",
    ActionID: randomUUID(),
    ActionParam: {
      Action: "com.ulanzi.ulanzideck.system.hotkey",
      Hotkey: hotkey,
    },
    LinkedTitle: true,
    Name: "快捷键",
    Plugin: { Name: "系统", UUID: "com.ulanzi.deck.system", Version: "1.0" },
    State: 0,
    ViewParam: [{ Icon: iconAbs || "", IconRel: iconRel || "", Text: text }],
  };
}

function ensurePromptScripts(tool) {
  const dir = join(ROOT, "scripts/prompts", tool);
  mkdirSync(dir, { recursive: true });
  const prompts = {};
  for (const s of SKILL_KEYS) {
    const sh = join(dir, `${s.id}.sh`);
    const body = `#!/bin/bash
printf %s ${JSON.stringify(`${s.prompt} `)} | pbcopy
osascript -e 'tell application "System Events" to keystroke "v" using command down' &>/dev/null || true
`;
    writeFileSync(sh, body);
    chmodSync(sh, 0o755);
    prompts[s.id] = sh;
  }
  return prompts;
}

function themeIcon(theme, id, pageImagesDir) {
  const src = join(THEMES, theme, `${id}.png`);
  if (!existsSync(src)) return { abs: "", rel: "" };
  mkdirSync(pageImagesDir, { recursive: true });
  const name = `theme_${theme}_${id}.png`;
  const dest = join(pageImagesDir, name);
  copyFileSync(src, dest);
  return { abs: dest, rel: `Images/${name}` };
}

function wireNavOnPage(page) {
  const keypad = page.Controllers?.find((c) => c.Type === "Keypad");
  const encoder = page.Controllers?.find((c) => c.Type === "Encoder");
  if (!keypad) return;
  keypad.Actions = keypad.Actions || {};

  const prevIcon = join(PLUGIN_DST, "Images/nav-prev.png");
  const nextIcon = join(PLUGIN_DST, "Images/nav-next.png");
  keypad.Actions["0_3"] = {
    ...vibeAction("com.vibe.deck.status.profile.prev", "Prev Profile", "前PF"),
    ViewParam: [
      {
        Icon: existsSync(prevIcon) ? prevIcon : "",
        IconRel: "",
        Text: "前PF",
      },
    ],
  };
  keypad.Actions["1_3"] = {
    ...vibeAction("com.vibe.deck.status.profile.next", "Next Profile", "次PF"),
    ViewParam: [
      {
        Icon: existsSync(nextIcon) ? nextIcon : "",
        IconRel: "",
        Text: "次PF",
      },
    ],
  };

  if (encoder) {
    encoder.Actions = encoder.Actions || {};
    encoder.Actions["4_3"] = {
      Action: "com.vibe.deck.status.page.dial",
      ActionID: randomUUID(),
      ActionParam: {
        Action: "com.vibe.deck.status.page.dial",
        knob_hold_left: {},
        knob_hold_right: {},
        knob_press: { direction: "right" },
        knob_rotate_left: { direction: "left", ticks: -1 },
        knob_rotate_right: { direction: "right", ticks: 1 },
      },
      LinkedTitle: true,
      Name: "Pages",
      Plugin: {
        Name: "Vibe Deck Status",
        UUID: "com.vibe.deck.status",
        Version: "1.1.0",
      },
      State: 0,
      ViewParam: [{ Icon: "", IconRel: "", Text: "Pages" }],
    };
  }
}

function applyCommandThemes(page, theme, pageDir) {
  const keypad = page.Controllers?.find((c) => c.Type === "Keypad");
  if (!keypad?.Actions) return;
  const map = [
    ["Accept", "accept"],
    ["Reject", "reject"],
    ["Send/Accept", "accept"],
    ["リクエストを承認", "accept"],
    ["リクエストを拒否", "reject"],
    ["Stop", "stop"],
    ["New Session", "new"],
    ["New Chat", "new"],
    ["新しい会話", "new"],
    ["New", "new"],
    ["Chat", "new"],
    ["Composer", "composer"],
    ["Model", "model"],
    ["モデル選択", "model"],
    ["Dictation", "dictation"],
    ["ディクテーション開始", "dictation"],
    ["Terminal", "terminal"],
    ["ターミナル切替", "terminal"],
    ["Diff", "diff"],
    ["Sidebar", "diff"],
    ["サイドパネル切替", "diff"],
    ["Close", "close"],
    ["閉じる", "close"],
    ["Agent", "agent"],
    ["Refresh", "refresh"],
    ["Settings", "settings"],
    ["設定", "settings"],
    ["Help", "help"],
    ["Keys", "help"],
    ["キーボードショートカットを表示", "help"],
    ["検索", "help"],
    ["ペットを起こす", "agent"],
    ["音声モード", "dictation"],
  ];
  for (const action of Object.values(keypad.Actions)) {
    const text = action.ViewParam?.[0]?.Text || action.Name || "";
    const hit = map.find(([label]) => text === label);
    if (!hit) continue;
    const { abs, rel } = themeIcon(theme, hit[1], join(pageDir, "Images"));
    if (!abs) continue;
    action.ViewParam = action.ViewParam || [{}];
    action.ViewParam[0] = {
      ...action.ViewParam[0],
      Icon: abs,
      IconRel: rel,
    };
  }
}

function buildSkillsPage(tool, theme, pageDir, prompts) {
  const images = join(pageDir, "Images");
  mkdirSync(images, { recursive: true });
  const actions = {};

  for (const s of SKILL_KEYS) {
    const { abs, rel } = themeIcon(theme, s.id, images);
    actions[s.key] = {
      Action: "com.ulanzi.ulanzideck.system.open",
      ActionID: randomUUID(),
      ActionParam: { Path: prompts[s.id] },
      LinkedTitle: true,
      Name: s.text,
      Plugin: { Name: "システム", UUID: "com.ulanzi.deck.system", Version: "1.0" },
      State: 0,
      ViewParam: [{ Icon: abs, IconRel: rel, Text: s.text }],
    };
  }

  for (const extra of TOOL_EXTRAS[tool] || []) {
    const { abs, rel } = themeIcon(theme, extra.id, images);
    actions[extra.key] = hotkeyAction(extra.text, extra.hotkey, abs, rel);
  }

  return {
    Controllers: [
      { Actions: {}, Type: "Encoder" },
      { Actions: actions, Type: "Keypad" },
    ],
    Icon: "",
    Name: "Skills",
  };
}

function ensureThirdPage(rootManifest, profileDir, theme) {
  const pages = rootManifest.Pages.Pages;
  if (pages.length >= 3) return pages[2];
  const id = randomUUID();
  const pageDir = join(profileDir, "Profiles", id);
  const images = join(pageDir, "Images");
  mkdirSync(images, { recursive: true });
  const settings = themeIcon(theme, "settings", images);
  const help = themeIcon(theme, "help", images);
  const page = {
    Controllers: [
      { Actions: {}, Type: "Encoder" },
      {
        Actions: {
          "0_0": hotkeyAction("Settings", "⌘  ,", settings.abs, settings.rel),
          "1_0": hotkeyAction("Help", "⌘  /", help.abs, help.rel),
          "2_0": vibeAction("com.vibe.deck.status.refresh", "Refresh", "更新"),
        },
        Type: "Keypad",
      },
    ],
    Icon: "",
    Name: "More",
  };
  writeJson(join(pageDir, "manifest.json"), page);
  pages.push(id);
  rootManifest.Pages.Pages = pages;
  return id;
}

function main() {
  mkdirSync(dirname(PLUGIN_DST), { recursive: true });
  cpSync(PLUGIN_SRC, PLUGIN_DST, { recursive: true });
  console.log("plugin ->", PLUGIN_DST);

  for (const dir of readdirSync(PROFILES)
    .filter((d) => d.endsWith(".ulanziProfile"))
    .map((d) => join(PROFILES, d))) {
    const rootPath = join(dir, "manifest.json");
    if (!existsSync(rootPath)) continue;
    const root = readJson(rootPath);
    let name = root.Name || "";

    if (name === "Vibe · Claude") {
      root.Name = "Vibe · Claude Code";
      name = root.Name;
      writeJson(rootPath, root);
      console.log("renamed ->", name);
    }

    const ai = AI[name];
    const pageIds = root.Pages?.Pages || [];

    if (ai) {
      const prompts = ensurePromptScripts(ai.tool);
      if (pageIds[1]) {
        const pageDir = join(dir, "Profiles", pageIds[1]);
        writeJson(
          join(pageDir, "manifest.json"),
          buildSkillsPage(ai.tool, ai.theme, pageDir, prompts),
        );
        console.log("skills page", name);
      }
      ensureThirdPage(root, dir, ai.theme);
      writeJson(rootPath, root);

      if (pageIds[0]) {
        const pageDir = join(dir, "Profiles", pageIds[0]);
        const pagePath = join(pageDir, "manifest.json");
        const page = readJson(pagePath);
        applyCommandThemes(page, ai.theme, pageDir);
        writeJson(pagePath, page);
      }

      const badge = join(THEMES, ai.theme, "badge.png");
      if (existsSync(badge)) {
        const iconName = `Vibe_${ai.theme}_badge.png`;
        copyFileSync(badge, join(dir, iconName));
        root.Icon = iconName;
        writeJson(rootPath, root);
      }
    }

    for (const pid of root.Pages?.Pages || []) {
      const pageDir = join(dir, "Profiles", pid);
      const pagePath = join(pageDir, "manifest.json");
      if (!existsSync(pagePath)) continue;
      const page = readJson(pagePath);
      wireNavOnPage(page);
      const keypad = page.Controllers?.find((c) => c.Type === "Keypad");
      if (keypad && !keypad.Actions["3_2"]) {
        keypad.Actions["3_2"] = {
          Action: "com.ulanzi.ulanzideck.smallwindow.window",
          ActionID: randomUUID(),
          ActionParam: { SmallViewMode: 1 },
          LinkedTitle: true,
          Name: "背景設定",
          Plugin: {},
          State: 0,
          ViewParam: [{ Icon: "", IconRel: "" }],
        };
      }
      writeJson(pagePath, page);
    }
    console.log("wired nav:", name);
  }

  const settingPath = join(
    homedir(),
    "Library/Application Support/Ulanzi/UlanziDeck/config/setting.json",
  );
  if (existsSync(settingPath)) {
    const setting = readJson(settingPath);
    if (setting.CurrentProfile === "Vibe · Claude") {
      setting.CurrentProfile = "Vibe · Claude Code";
      writeFileSync(settingPath, JSON.stringify(setting, null, "\t") + "\n");
    }
  }

  console.log("\nDone. Restart Ulanzi Studio to load plugin + profiles.");
}

main();
