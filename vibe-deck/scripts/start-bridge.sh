#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PORT="${VIBE_DECK_PORT:-17823}"
DEMO="${VIBE_DECK_DEMO:-1}"
LOG="/tmp/vibe-deck-bridge.log"
PIDFILE="/tmp/vibe-deck-bridge.pid"

cd "$ROOT/bridge"
npm run build >/dev/null

if [[ -f "$PIDFILE" ]] && kill -0 "$(cat "$PIDFILE")" 2>/dev/null; then
  kill "$(cat "$PIDFILE")" 2>/dev/null || true
  sleep 0.5
fi
pkill -f "vibe-deck/bridge/dist/index.js" 2>/dev/null || true

# Keepalive wrapper: restart if the bridge exits
nohup bash -c "
while true; do
  echo \"[$(date -Iseconds)] starting bridge demo=$DEMO\" >>'$LOG'
  VIBE_DECK_DEMO='$DEMO' VIBE_DECK_PORT='$PORT' node '$ROOT/bridge/dist/index.js' >>'$LOG' 2>&1 || true
  echo \"[$(date -Iseconds)] bridge exited; restarting in 1s\" >>'$LOG'
  sleep 1
done
" >/dev/null 2>&1 &
echo $! >"$PIDFILE"
sleep 1
curl -fsS "http://127.0.0.1:$PORT/health"
echo
echo "bridge keepalive pid $(cat "$PIDFILE") demo=$DEMO"
