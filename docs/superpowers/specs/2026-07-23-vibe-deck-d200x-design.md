# Vibe Deck for D200X — Design Spec

**Date:** 2026-07-23  
**Status:** Approved for planning  
**Hardware:** Ulanzi D200X Creative Deck  
**Software:** Ulanzi Studio 3.1.9+ (macOS Apple Silicon)  
**Reference product:** OpenAI × Work Louder Codex Micro (2026-07)

## 1. Goal

Reproduce the Codex Micro experience—“see agent state by color, control agents by touch”—on the Ulanzi D200X, then extend it across three desktop apps used for vibe coding:

1. **Claude** (Claude.app / Claude Code desktop flows)
2. **Codex** (ChatGPT.app Codex)
3. **Cursor** (Cursor.app)

Minimum bar: **Codex Micro feature parity**. Stretch: D200X-native upgrades (main display, extra agent slots, prompt packs, cross-tool hub) plus a Japanese user manual.

## 2. Non-goals

- Cloning Codex Micro hardware or OpenAI’s proprietary USB/Bluetooth protocol bit-for-bit
- Supporting Windows in v1 (macOS only)
- Building a general Stream Deck marketplace product
- Guaranteeing pixel-identical RGB edge glow (D200X uses LCD keys + main panel)

## 3. Users and context

- Primary user: solo vibe coder switching among Claude, Codex, and Cursor desktop apps
- Environment: macOS Apple Silicon, Ulanzi Studio running, D200X connected over USB
- Already installed on target machine: `ChatGPT.app`, `Claude.app`, `Cursor.app`, Ulanzi Studio

## 4. Color language (Codex Micro parity)

| Color | State ID | Meaning |
|-------|----------|---------|
| White / light gray | `idle` | Thread idle / waiting |
| Blue | `thinking` | Model thinking / working |
| Green | `done` | Task complete / unread completion |
| Amber / peach | `needs_input` | Needs approval or human answer |
| Red | `error` | Error / failed turn |
| Dim gray | `empty` | Slot unused |

Rules:

- Same palette across all three presets (visual language must stay consistent).
- Amber/red take priority in layout (“notification priority mode” can promote those slots upward).
- Pressing an agent key focuses/raises the matching thread/window when the bridge can resolve it.

## 5. Hardware mapping (D200X)

### 5.1 Codex Micro → D200X

| Codex Micro | D200X mapping |
|-------------|---------------|
| 6 Agent Keys (RGB) | 8 LCD Agent Keys (color tiles live-updated); unused = `empty` |
| Accept / Reject | Dedicated command keys |
| New chat / Branch | Dedicated command keys |
| Push-to-talk | Dictation / voice shortcut key |
| Rotary dial (reasoning) | Dial 1 — depth / effort / model aggressiveness (app-specific) |
| Joystick workflows | Folder page + named workflow keys (Review / Debug / Refactor / Test) |
| Perimeter glow | Main 5.5" panel accent bar + status header |

### 5.2 Layout (per tool preset)

**Page 1 — Control (home)**

- Row A: Agent slots 1–4 (live color)
- Row B: Agent slots 5–8 (live color)
- Command cluster: Accept, Reject, New, Branch/Fork, Stop, Dictation
- Hub keys: Switch to Claude / Codex / Cursor (auto profile switch)
- Nav: Prompt Pack folder, Settings/Help

**Page 2 — Prompt Pack**

- Fixed vibe-coding snippets: Design, Implement, Review, Fix bug, Write tests, Explain, Commit message, Summarize diff
- Insert as text or trigger app-specific send when possible

**Dials**

- Dial 1: Reasoning / effort / mode cycle
- Dial 2: Active agent focus cycle
- Dial 3: Scroll chat or system volume (user preference in settings; default = chat scroll)

**Main display**

- Active tool name
- Per-slot mini status list (name, state, elapsed)
- Count badges: thinking / needs_input / error
- Bridge connection health (OK / degraded / offline)

## 6. Presets

Three Ulanzi linked presets (auto-switch when the app is foreground when possible; manual hub keys always available):

| Preset ID | Linked app | Display name |
|-----------|------------|--------------|
| `vibe-claude` | Claude.app | Vibe · Claude |
| `vibe-codex` | ChatGPT.app | Vibe · Codex |
| `vibe-cursor` | Cursor.app | Vibe · Cursor |

Shared assets: color tiles, icon family, prompt pack copy. Tool-specific: shortcuts, bridge adapter, command labels.

## 7. Architecture

```
Desktop apps (Claude / ChatGPT-Codex / Cursor)
        │
        ▼
Vibe Deck Bridge (local daemon)
  - adapters per tool
  - normalizes to AgentSnapshot[]
  - priority ranking / slot assignment
        │
        ▼
Ulanzi Studio Plugin (com.vibe.deck.status)
  - setImage / setTitle on agent keys
  - main panel HTML/status
  - key press → focus / command
        │
        ▼
D200X hardware
```

### 7.1 Normalized model

```ts
type AgentState = 'idle' | 'thinking' | 'done' | 'needs_input' | 'error' | 'empty'

interface AgentSnapshot {
  slot: number            // 1..8
  id: string              // stable thread/session id when known
  title: string           // short label for key + panel
  state: AgentState
  updatedAt: number       // epoch ms
  focusAction?: FocusAction
}

interface FocusAction {
  kind: 'activate_app' | 'apple_script' | 'url' | 'shortcut'
  payload: string
}
```

Bridge polls or subscribes at ~1 Hz (tunable). Plugin paints only on state change to avoid flicker.

### 7.2 Adapters (v1)

**Codex adapter (highest fidelity target)**

- Prefer ChatGPT desktop / Codex app-server style events when discoverable on localhost.
- Fallback: parse local Codex session/rollout signals if desktop bridge unavailable.
- Map thread states → `AgentState` using Micro semantics (idle/thinking/done/needs_input/error).

**Claude adapter**

- Prefer Desktop session list when accessible.
- Supported fallback: `claude agents --json` and `claude daemon status` for background sessions.
- Map needs-input / completed / failed notifications to amber / green / red.

**Cursor adapter (best-effort)**

- No stable public local agent-status API assumed.
- v1 strategies (in order): foreground Composer/Agent UI signals if exposed; local process + recent agent transcript/log heuristics; otherwise command keys work, agent colors may show aggregate `thinking`/`idle` only.
- Manual must document fidelity gap vs Codex/Claude.

### 7.3 Commands

Each preset maps command keys to the target app’s real shortcuts where known (examples; verify on install):

- Codex / ChatGPT: New chat, dictation, accept/reject custom approval shortcuts, companion focus
- Claude Desktop / Code tab: New session, stop (`Esc`), permission/effort/model menus, side chat
- Cursor: Composer/Agent accept/reject, toggle terminal, chat focus — use current Cursor defaults and allow remap in docs

If a shortcut cannot be confirmed, ship as “user-configurable” in the preset inspector rather than guessing wrong.

## 8. Enhancements beyond Micro

1. **8 agent slots** (vs 6)
2. **Main-panel dashboard** with names + timers
3. **Notification priority mode**: amber/red float to slots 1–N
4. **Prompt Pack page** for vibe-coding macros
5. **Cross-tool hub** on every preset
6. **Bridge health** indicator (Micro hides this complexity)
7. **Exportable profiles** + Japanese manual + one-page quick reference

## 9. Deliverables

| Item | Description |
|------|-------------|
| Presets | 3× `.ulanziDeckProfile` (or ProfilesV2 equivalents) |
| Plugin | `com.vibe.deck.status` for live tiles + panel |
| Bridge | macOS launch-agent-friendly local daemon |
| Icons | Color state tiles + command icons (shared set) |
| Manual | Japanese 取扱説明書 (setup, colors, keymap, troubleshooting) |
| Quick ref | 1-page PDF/Markdown keymap cheat sheet |
| Install script | Optional helper to install plugin + start bridge |

## 10. Setup requirements (for manual)

1. D200X connected; Ulanzi Studio running; Accessibility enabled for Ulanzi Studio
2. ChatGPT / Claude / Cursor installed and signed in
3. Install Vibe Deck plugin + bridge
4. Import three presets; enable app-linked switching
5. Keep bridge running for live colors (without bridge, keys still send shortcuts but stay static)

## 11. Risks and mitigations

| Risk | Mitigation |
|------|------------|
| OpenAI/ChatGPT changes private bridge protocol | Adapter interface + fallbacks; degrade gracefully to static colors |
| Claude Desktop lacks same status surface as CLI agents | Dual path Desktop + `claude agents --json` |
| Cursor status unreliable | Document best-effort; still ship full command surface |
| Ulanzi plugin API limits for main panel | Feature-detect; if panel unsupported, use key titles only |
| Shortcut drift across app versions | Central keymap config + “verify shortcuts” section in manual |

## 12. Success criteria

- With ChatGPT Codex running multiple threads, D200X agent keys change color within ~1–2s of state change
- Accept / Reject / New / Stop / Dictation work without touching the keyboard for the focused tool
- Switching hub keys moves between the three presets reliably
- Claude and Cursor presets use the same color language and layout grammar
- A new user can finish setup using only the Japanese manual in under 20 minutes
- Without bridge, device remains usable as a shortcut deck (no hard failure)

## 13. Implementation phases

1. **Foundation** — color assets, layout grammar, empty plugin that paints mock states
2. **Codex live** — Codex adapter + focus + command keys (Micro parity on one tool)
3. **Claude live** — Claude adapter + commands
4. **Cursor live** — best-effort adapter + commands
5. **Enhancements** — priority mode, prompt pack, main panel polish
6. **Docs** — 取扱説明書 + quick reference + install script

## 14. Open decisions (resolved)

| Decision | Choice |
|----------|--------|
| Preset strategy | Three separate tool presets |
| Fidelity | Closest practical to Codex Micro + D200X upgrades |
| Scope | All three tools get live colors in v1 (Cursor may be lower fidelity) |
| Agent slots | 8 (Micro’s 6 + 2) |
| Docs | Japanese manual included |
| Platform | macOS Apple Silicon first |

## 15. Next step

Write an implementation plan under `docs/superpowers/plans/` and execute phase by phase, starting with Foundation + Codex live.
