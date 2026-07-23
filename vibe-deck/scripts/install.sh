#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PLUGIN_SRC="$ROOT/plugin/com.vibe.deck.status.ulanziPlugin"
PLUGIN_DST="$HOME/Library/Application Support/Ulanzi/UlanziDeck/Plugins/com.vibe.deck.status.ulanziPlugin"
PRESET_DST="$HOME/Library/Application Support/Ulanzi/UlanziDeck/ProfilesV2"
LAUNCH_AGENT="$HOME/Library/LaunchAgents/com.vibe.deck.bridge.plist"
PORT="${VIBE_DECK_PORT:-17823}"

echo "==> Generate icons"
node "$ROOT/scripts/generate-icons.mjs"

echo "==> Build presets"
node "$ROOT/scripts/build-presets.mjs"

echo "==> Build bridge"
cd "$ROOT/bridge"
npm install
npm run build

echo "==> Install plugin deps"
cd "$PLUGIN_SRC"
npm install --omit=dev

echo "==> Copy plugin to Ulanzi Plugins"
mkdir -p "$(dirname "$PLUGIN_DST")"
rm -rf "$PLUGIN_DST"
cp -R "$PLUGIN_SRC" "$PLUGIN_DST"

echo "==> Copy presets into ProfilesV2 (as importable folders)"
mkdir -p "$PRESET_DST"
for preset in "$ROOT/presets"/Vibe*; do
  name="$(basename "$preset")"
  id="$(uuidgen | tr '[:upper:]' '[:lower:]')"
  dest="$PRESET_DST/${id}.ulanziProfile"
  rm -rf "$dest"
  mkdir -p "$dest"
  cp -R "$preset"/* "$dest/"
  # ensure Device UUID if D200X connected serial known
  if [[ -f "$dest/manifest.json" ]]; then
    node -e "
      const fs=require('fs');
      const p='$dest/manifest.json';
      const j=JSON.parse(fs.readFileSync(p,'utf8'));
      j.Device=j.Device||{};
      j.Device.Model='D200X';
      j.Device.UUID=j.Device.UUID||'02d23a045u3671258';
      j.Name=j.Name||'$name';
      fs.writeFileSync(p, JSON.stringify(j,null,2));
    "
  fi
  echo "  installed profile: $name -> $dest"
done

echo "==> Write LaunchAgent for bridge"
mkdir -p "$(dirname "$LAUNCH_AGENT")"
cat > "$LAUNCH_AGENT" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key><string>com.vibe.deck.bridge</string>
  <key>ProgramArguments</key>
  <array>
    <string>/usr/bin/env</string>
    <string>node</string>
    <string>$ROOT/bridge/dist/index.js</string>
  </array>
  <key>EnvironmentVariables</key>
  <dict>
    <key>VIBE_DECK_PORT</key><string>$PORT</string>
    <key>PATH</key><string>/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin</string>
  </dict>
  <key>RunAtLoad</key><true/>
  <key>KeepAlive</key><true/>
  <key>StandardOutPath</key><string>$HOME/Library/Logs/vibe-deck-bridge.log</string>
  <key>StandardErrorPath</key><string>$HOME/Library/Logs/vibe-deck-bridge.err.log</string>
</dict>
</plist>
EOF

launchctl unload "$LAUNCH_AGENT" 2>/dev/null || true
launchctl load "$LAUNCH_AGENT" 2>/dev/null || true

# Also start immediately in case launchctl restricted
pkill -f "vibe-deck/bridge/dist/index.js" 2>/dev/null || true
VIBE_DECK_PORT="$PORT" node "$ROOT/bridge/dist/index.js" >/tmp/vibe-deck-bridge.log 2>&1 &
sleep 1

if curl -fsS "http://127.0.0.1:$PORT/health" >/dev/null; then
  echo "==> Bridge OK on :$PORT"
else
  echo "==> Bridge health check failed — see /tmp/vibe-deck-bridge.log"
fi

cat <<MSG

Install complete.

Next steps:
1. Quit & reopen Ulanzi Studio (so it loads the Vibe Deck plugin)
2. Open profiles: Vibe · Claude / Vibe · Codex / Vibe · Cursor
3. System Settings → Privacy & Security → Accessibility → enable Ulanzi Studio
4. Optional demo colors: VIBE_DECK_DEMO=1 node $ROOT/bridge/dist/index.js

Manual: $ROOT/docs/取扱説明書.md
Quick ref: $ROOT/docs/クイックリファレンス.md
MSG
