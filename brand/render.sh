#!/bin/sh
# Renders the social preview and the app icons into public/ with headless Chrome (macOS).
# Run from the repo root after `pnpm install`: sh brand/render.sh
set -e
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TMP="$(mktemp -d)"

shot() {
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
    --virtual-time-budget=3000 --window-size="$2" --screenshot="$3" "file://$ROOT/brand/$1" 2>/dev/null
}

shot og.html 1200,630 "$ROOT/public/og.png"

shot icon.html 512,512 "$TMP/icon.png"
sips -c 512 512 "$TMP/icon.png" --out "$TMP/icon-512.png" >/dev/null
sips -z 180 180 "$TMP/icon-512.png" --out "$ROOT/public/apple-touch-icon.png" >/dev/null
sips -z 32 32 "$TMP/icon-512.png" --out "$ROOT/public/favicon-32.png" >/dev/null

rm -rf "$TMP"
echo "Rendered public/og.png, public/apple-touch-icon.png, public/favicon-32.png"
