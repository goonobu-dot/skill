#!/usr/bin/env node
/**
 * Wire all D200X profiles with:
 * - bottom 0_3 / 1_3 → profile.prev / profile.next
 * - dial 4_3 → page.dial
 * - AI profiles: aligned Control page, English-only themed icons (no title overlay), Skills, page 3
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
import { spawnSync } from "node:child_process";

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
  "Vibe · Claude": {
    tool: "claude",
    theme: "claude",
    rename: "Vibe · Claude Code",
  },
  "Vibe · Claude Code": { tool: "claude", theme: "claude" },
};

/** Page1 command row — same structure for all AI tools, English labels in icon only. */
const CONTROL_COMMANDS = {
  cursor: [
    { key: "0_1", id: "accept", hotkey: "⌘  ⌅" },
    { key: "1_1", id: "reject", hotkey: "⌘  ⌫" },
    { key: "2_1", id: "diff", hotkey: "⌘  B", switchHotkey: true },
    { key: "3_1", id: "model", hotkey: "⌘  /" },
    { key: "4_1", id: "close", hotkey: "⌘  W" },
    { key: "0_2", id: "dictation", hotkey: "Fn Fn" },
    { key: "1_2", id: "agent", hotkey: "⌘  ." },
    { key: "2_2", id: "refresh", refresh: true },
  ],
  codex: [
    { key: "0_1", id: "accept", hotkey: "⌘  ⌅" },
    { key: "1_1", id: "reject", hotkey: "⌘  ⌫" },
    { key: "2_1", id: "diff", hotkey: "⇧  ⌘  D", switchHotkey: true },
    { key: "3_1", id: "model", hotkey: "⌘  /" },
    { key: "4_1", id: "close", hotkey: "⌘  W" },
    { key: "0_2", id: "dictation", hotkey: "⌃  ⇧  D" },
    { key: "1_2", id: "new", hotkey: "⌘  N" },
    { key: "2_2", id: "refresh", refresh: true },
  ],
  claude: [
    { key: "0_1", id: "accept", hotkey: "⌘  ⌅" },
    { key: "1_1", id: "stop", hotkey: "⎋" },
    { key: "2_1", id: "diff", hotkey: "⇧  ⌘  D", switchHotkey: true },
    { key: "3_1", id: "model", hotkey: "⇧  ⌘  I" },
    { key: "4_1", id: "close", hotkey: "⌘  W" },
    { key: "0_2", id: "dictation", hotkey: "⌃  ⇧  D" },
    { key: "1_2", id: "new", hotkey: "⌘  N" },
    { key: "2_2", id: "refresh", refresh: true },
  ],
};

const SKILL_KEYS = [
  { key: "0_0", id: "design", prompt: "Design this feature:" },
  { key: "1_0", id: "implement", prompt: "Implement this:" },
  { key: "2_0", id: "review", prompt: "Review this code:" },
  { key: "3_0", id: "fix", prompt: "Fix this bug:" },
  { key: "4_0", id: "test", prompt: "Write tests for:" },
  { key: "0_1", id: "explain", prompt: "Explain this:" },
  { key: "1_1", id: "commit", prompt: "Write a commit message for:" },
  { key: "2_1", id: "summary", prompt: "Summarize the diff:" },
];

const TOOL_EXTRAS = {
  cursor: [
    { key: "3_1", id: "composer", hotkey: "⌘  I" },
    { key: "4_1", id: "agent", hotkey: "⌘  ." },
    { key: "0_2", id: "terminal", hotkey: "⌃  `" },
  ],
  codex: [
    { key: "3_1", id: "new", hotkey: "⌘  N" },
    { key: "4_1", id: "dictation", hotkey: "⌃  ⇧  D" },
    { key: "0_2", id: "model", hotkey: "⌘  /" },
  ],
  claude: [
    { key: "3_1", id: "new", hotkey: "⌘  N" },
    { key: "4_1", id: "diff", hotkey: "⇧  ⌘  D" },
    { key: "0_2", id: "stop", hotkey: "⎋" },
  ],
};

function readJson(p) {
  return JSON.parse(readFileSync(p, "utf8"));
}

function writeJson(p, obj) {
  writeFileSync(p, JSON.stringify(obj, null, 2) + "\n");
}

/** Icon carries English label — keep Studio title empty to avoid overlap. */
function viewNoTitle(iconAbs = "", iconRel = "") {
  return [{ Icon: iconAbs || "", IconRel: iconRel || "", Text: "" }];
}

function vibeAction(uuid, name, iconAbs = "", iconRel = "") {
  return {
    Action: uuid,
    ActionID: randomUUID(),
    ActionParam: {},
    LinkedTitle: false,
    Name: name,
    Plugin: {
      Name: "Vibe Deck Status",
      UUID: "com.vibe.deck.status",
      Version: "1.1.0",
    },
    State: 0,
    ViewParam: viewNoTitle(iconAbs, iconRel),
  };
}

function hotkeyAction(hotkey, iconAbs, iconRel, switchHotkey = false) {
  return {
    Action: switchHotkey
      ? "com.ulanzi.ulanzideck.system.switchhotkey"
      : "com.ulanzi.ulanzideck.system.hotkey",
    ActionID: randomUUID(),
    ActionParam: {
      Action: switchHotkey
        ? "com.ulanzi.ulanzideck.system.switchhotkey"
        : "com.ulanzi.ulanzideck.system.hotkey",
      Hotkey: hotkey,
    },
    LinkedTitle: false,
    Name: "hotkey",
    Plugin: { Name: "系统", UUID: "com.ulanzi.deck.system", Version: "1.0" },
    State: 0,
    ViewParam: viewNoTitle(iconAbs, iconRel),
  };
}

function agentAction(slot, tool) {
  return {
    Action: "com.vibe.deck.status.agent",
    ActionID: randomUUID(),
    ActionParam: { slot, tool },
    LinkedTitle: false,
    Name: `Agent ${slot}`,
    Plugin: {
      Name: "Vibe Deck Status",
      UUID: "com.vibe.deck.status",
      Version: "1.1.0",
    },
    State: 0,
    ViewParam: viewNoTitle(),
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

  const prevApp = join(ROOT, "scripts/VibeProfilePrev.app");
  const nextApp = join(ROOT, "scripts/VibeProfileNext.app");
  const prevIcon = join(PLUGIN_DST, "Images/nav-prev.png");
  const nextIcon = join(PLUGIN_DST, "Images/nav-next.png");

  // Use native system.open → .app so presses work even if custom plugin
  // run/keyDown events are not delivered by Studio.
  keypad.Actions["0_3"] = {
    Action: "com.ulanzi.ulanzideck.system.open",
    ActionID: randomUUID(),
    ActionParam: { Path: prevApp },
    LinkedTitle: false,
    Name: "Prev Profile",
    Plugin: { Name: "システム", UUID: "com.ulanzi.deck.system", Version: "1.0" },
    State: 0,
    ViewParam: viewNoTitle(existsSync(prevIcon) ? prevIcon : "", ""),
  };
  keypad.Actions["1_3"] = {
    Action: "com.ulanzi.ulanzideck.system.open",
    ActionID: randomUUID(),
    ActionParam: { Path: nextApp },
    LinkedTitle: false,
    Name: "Next Profile",
    Plugin: { Name: "システム", UUID: "com.ulanzi.deck.system", Version: "1.0" },
    State: 0,
    ViewParam: viewNoTitle(existsSync(nextIcon) ? nextIcon : "", ""),
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
      LinkedTitle: false,
      Name: "Pages",
      Plugin: {
        Name: "Vibe Deck Status",
        UUID: "com.vibe.deck.status",
        Version: "1.1.1",
      },
      State: 0,
      ViewParam: viewNoTitle(),
    };
  }
}

function alignControlPage(page, tool, theme, pageDir) {
  const keypad = page.Controllers?.find((c) => c.Type === "Keypad");
  if (!keypad) return;
  const images = join(pageDir, "Images");
  const actions = { ...(keypad.Actions || {}) };

  // Top row: 5 live agent slots (same for Codex / Cursor / Claude Code)
  for (let i = 0; i < 5; i += 1) {
    actions[`${i}_0`] = agentAction(i + 1, tool);
  }

  for (const cmd of CONTROL_COMMANDS[tool] || []) {
    const { abs, rel } = themeIcon(theme, cmd.id, images);
    if (cmd.refresh) {
      actions[cmd.key] = vibeAction(
        "com.vibe.deck.status.refresh",
        "Refresh",
        abs,
        rel,
      );
    } else {
      actions[cmd.key] = hotkeyAction(
        cmd.hotkey,
        abs,
        rel,
        Boolean(cmd.switchHotkey),
      );
    }
  }

  // Keep large key / background if present
  if (!actions["3_2"]) {
    actions["3_2"] = {
      Action: "com.ulanzi.ulanzideck.smallwindow.window",
      ActionID: randomUUID(),
      ActionParam: { SmallViewMode: 1 },
      LinkedTitle: false,
      Name: "Background",
      Plugin: {},
      State: 0,
      ViewParam: viewNoTitle(),
    };
  }

  keypad.Actions = actions;
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
      LinkedTitle: false,
      Name: s.id,
      Plugin: { Name: "システム", UUID: "com.ulanzi.deck.system", Version: "1.0" },
      State: 0,
      ViewParam: viewNoTitle(abs, rel),
    };
  }

  for (const extra of TOOL_EXTRAS[tool] || []) {
    const { abs, rel } = themeIcon(theme, extra.id, images);
    actions[extra.key] = hotkeyAction(extra.hotkey, abs, rel);
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
  const refresh = themeIcon(theme, "refresh", images);
  const page = {
    Controllers: [
      { Actions: {}, Type: "Encoder" },
      {
        Actions: {
          "0_0": hotkeyAction("⌘  ,", settings.abs, settings.rel),
          "1_0": hotkeyAction("⌘  /", help.abs, help.rel),
          "2_0": vibeAction(
            "com.vibe.deck.status.refresh",
            "Refresh",
            refresh.abs,
            refresh.rel,
          ),
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

function stripTitles(page) {
  for (const c of page.Controllers || []) {
    for (const action of Object.values(c.Actions || {})) {
      if (!action.ViewParam?.[0]) continue;
      // Keep titles empty when an icon is present (icon has English label).
      const hasIcon = action.ViewParam[0].Icon || action.ViewParam[0].IconRel;
      const isAgent = String(action.Action || "").includes("status.agent");
      if (hasIcon || isAgent) {
        action.LinkedTitle = false;
        action.ViewParam[0].Text = "";
      }
    }
  }
}

function main() {
  // Ensure profile-switch helper apps exist (system.open can launch .app)
  const prevApp = join(ROOT, "scripts/VibeProfilePrev.app");
  const nextApp = join(ROOT, "scripts/VibeProfileNext.app");
  const py = join(ROOT, "scripts/switch-profile.py");
  for (const [app, dir] of [
    [prevApp, "prev"],
    [nextApp, "next"],
  ]) {
    try {
      spawnSync(
        "osacompile",
        ["-o", app, "-e", `do shell script "/usr/bin/python3 '${py}' ${dir}"`],
        { stdio: "ignore" },
      );
    } catch {
      // ignore
    }
  }

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
      if (pageIds[0]) {
        const pageDir = join(dir, "Profiles", pageIds[0]);
        const pagePath = join(pageDir, "manifest.json");
        const page = readJson(pagePath);
        alignControlPage(page, ai.tool, ai.theme, pageDir);
        writeJson(pagePath, page);
        console.log("aligned control page", name);
      }
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
      stripTitles(page);
      const keypad = page.Controllers?.find((c) => c.Type === "Keypad");
      if (keypad && !keypad.Actions["3_2"]) {
        keypad.Actions["3_2"] = {
          Action: "com.ulanzi.ulanzideck.smallwindow.window",
          ActionID: randomUUID(),
          ActionParam: { SmallViewMode: 1 },
          LinkedTitle: false,
          Name: "Background",
          Plugin: {},
          State: 0,
          ViewParam: viewNoTitle(),
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
