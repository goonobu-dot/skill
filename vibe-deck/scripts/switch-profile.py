#!/usr/bin/env python3
"""Cycle Ulanzi D200X profiles and ask Studio to apply CurrentProfile."""

from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

PROFILES = (
    Path.home() / "Library/Application Support/Ulanzi/UlanziDeck/ProfilesV2"
)
SETTING = (
    Path.home()
    / "Library/Application Support/Ulanzi/UlanziDeck/config/setting.json"
)
SETTING_SOURCE = (
    Path.home()
    / "Library/Application Support/Ulanzi/UlanziDeck/config/setting_source.json"
)
RING_OVERRIDE = (
    Path.home()
    / "Library/Application Support/Ulanzi/UlanziDeck/Plugins"
    / "com.vibe.deck.status.ulanziPlugin/profile-ring.json"
)
LOG = Path.home() / "Library/Logs/vibe-deck-profile-switch.log"


def log(msg: str) -> None:
    line = msg + "\n"
    try:
        LOG.parent.mkdir(parents=True, exist_ok=True)
        with LOG.open("a", encoding="utf-8") as f:
            f.write(line)
    except OSError:
        pass
    print(line, end="")


def read_json(path: Path, fallback):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return fallback


def list_profiles() -> list[dict]:
    override = read_json(RING_OVERRIDE, None)
    if isinstance(override, dict) and isinstance(override.get("names"), list):
        return [{"name": n, "uuid": None} for n in override["names"] if n]

    out = []
    if not PROFILES.exists():
        return out
    for d in PROFILES.iterdir():
        if not d.name.endswith(".ulanziProfile"):
            continue
        j = read_json(d / "manifest.json", None)
        if not j or not j.get("Name"):
            continue
        out.append(
            {
                "name": j["Name"],
                "uuid": d.name.replace(".ulanziProfile", ""),
            }
        )
    out.sort(key=lambda p: p["name"])
    return out


def write_current(name: str) -> None:
    setting = read_json(SETTING, {})
    setting["CurrentProfile"] = name
    SETTING.write_text(
        json.dumps(setting, indent="\t", ensure_ascii=False) + "\n"
    )

    src = read_json(SETTING_SOURCE, None)
    if isinstance(src, dict) and isinstance(src.get("Devices"), list):
        for d in src["Devices"]:
            if d.get("DeviceType") in ("D200X", "D200") or "CurrentProfile" in d:
                d["CurrentProfile"] = name
        SETTING_SOURCE.write_text(json.dumps(src, ensure_ascii=False))


def notify_studio(name: str) -> None:
    script = f'''
set targetName to {json.dumps(name)}
try
  tell application "Ulanzi Studio" to activate
end try
delay 0.2
tell application "System Events"
  if not (exists process "Ulanzi Studio") then return "miss"
  tell process "Ulanzi Studio"
    set frontmost to true
    try
      repeat with w in windows
        try
          repeat with pb in pop up buttons of w
            try
              click pb
              delay 0.12
              if exists menu item targetName of menu 1 of pb then
                click menu item targetName of menu 1 of pb
                return "ok"
              else
                key code 53
              end if
            end try
          end repeat
        end try
      end repeat
    end try
  end tell
end tell
return "miss"
'''
    try:
        r = subprocess.run(
            ["osascript", "-e", script],
            capture_output=True,
            text=True,
            timeout=6,
        )
        if "ok" in (r.stdout or ""):
            log(f"studio UI selected {name!r}")
            return
    except Exception as err:
        log(f"studio UI failed: {err}")

    # Fallback: quick relaunch so Studio reloads CurrentProfile from disk.
    log(f"studio relaunch for {name!r}")
    subprocess.run(
        [
            "osascript",
            "-e",
            'try\ntell application "Ulanzi Studio" to quit\nend try',
        ],
        capture_output=True,
        timeout=5,
    )
    subprocess.run(["sleep", "0.7"], check=False)
    subprocess.Popen(
        ["open", "-a", "Ulanzi Studio"],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )


def main() -> int:
    direction = (sys.argv[1] if len(sys.argv) > 1 else "next").lower()
    profiles = list_profiles()
    if not profiles:
        log("no profiles found")
        return 1

    setting = read_json(SETTING, {})
    cur = str(setting.get("CurrentProfile") or "")
    idx = next((i for i, p in enumerate(profiles) if p["name"] == cur), 0)
    delta = -1 if direction in ("prev", "previous", "-1") else 1
    nxt = profiles[(idx + delta) % len(profiles)]
    write_current(nxt["name"])
    log(
        f"switch {direction}: {cur!r} -> {nxt['name']!r} ({len(profiles)} profiles)"
    )
    notify_studio(nxt["name"])

    subprocess.Popen(
        ["afplay", "/System/Library/Sounds/Tink.aiff"],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
