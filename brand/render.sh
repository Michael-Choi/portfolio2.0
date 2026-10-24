#!/bin/sh
# Renders the social preview, its video, and the app icons into public/ with headless Chrome and ffmpeg (macOS).
# Run from the repo root after `pnpm install`: sh brand/render.sh
set -e
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TMP="$(mktemp -d)"
# 12.8 s at 30 fps. Keep it in sync with FPS and SCENES in brand/og.html.
FRAMES=384

# Each Chrome gets its own profile, so several can run at once. Arguments after the third go to Chrome.
shot() {
  page="$1" size="$2" out="$3"
  shift 3
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
    --user-data-dir="$(mktemp -d "$TMP/profile.XXXXXX")" "$@" \
    --virtual-time-budget=3000 --window-size="$size" --screenshot="$out" "file://$ROOT/brand/$page" 2>/dev/null
}

shot og.html 1200,630 "$ROOT/public/og.png"

# Renders the video frames eight at a time.
i=0
while [ "$i" -lt "$FRAMES" ]; do
  shot "og.html?frame=$i" 1200,630 "$TMP/frame-$(printf %04d "$i").png" &
  i=$((i + 1))
  if [ $((i % 8)) -eq 0 ]; then wait; fi
done
wait
ffmpeg -y -loglevel error -framerate 30 -i "$TMP/frame-%04d.png" \
  -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p -movflags +faststart -an "$ROOT/public/og.mp4"

shot icon.html 512,512 "$TMP/icon.png"
sips -c 512 512 "$TMP/icon.png" --out "$TMP/icon-512.png" >/dev/null
sips -z 180 180 "$TMP/icon-512.png" --out "$ROOT/public/apple-touch-icon.png" >/dev/null

# The PNG favicon keeps the SVG favicon's rounded corners, so it renders the SVG on a clear background.
shot ../public/favicon.svg 512,512 "$TMP/favicon.png" --default-background-color=00000000
sips -z 32 32 "$TMP/favicon.png" --out "$ROOT/public/favicon-32.png" >/dev/null

rm -rf "$TMP"
echo "Rendered public/og.png, public/og.mp4, public/apple-touch-icon.png, public/favicon-32.png"
