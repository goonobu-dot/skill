# Vibe Deck for D200X

Codex Micro–inspired live agent status + control surface for Ulanzi D200X.

Supports **Claude Code**, **Codex (ChatGPT)**, and **Cursor** on macOS, with distinct visual themes per tool.

## Quick start

```bash
./scripts/install.sh
```

Then restart Ulanzi Studio.

## Hardware nav

| Control | Action |
|---------|--------|
| Bottom left / right buttons | Cycle all Studio profiles (dynamic N) |
| Rightmost dial | Pages 1 ↔ 2 ↔ 3 within current profile |

## Demo colors

```bash
VIBE_DECK_DEMO=1 node bridge/dist/index.js
```

## Rewire after profile changes

```bash
python3 scripts/generate-icons.py
python3 scripts/generate-tool-themes.py
node scripts/wire-deck.mjs
```

## Docs

- [取扱説明書](docs/取扱説明書.md)
- [クイックリファレンス](docs/クイックリファレンス.md)
