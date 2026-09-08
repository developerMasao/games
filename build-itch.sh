#!/usr/bin/env bash
# Package a game directory as an itch.io HTML5 upload.
# itch.io requires index.html at the root of the zip.
#   ./build-itch.sh agent64-facility
set -euo pipefail
GAME="${1:?usage: ./build-itch.sh <game-directory>}"
GAME="${GAME%/}"
[ -f "$GAME/index.html" ] || { echo "no $GAME/index.html" >&2; exit 1; }
OUT="dist/$GAME.zip"
mkdir -p dist
rm -f "$OUT"
( cd "$GAME" && zip -q -r -X "../$OUT" . -x '*.md' '.*' '__MACOSX/*' )
echo "$OUT"
unzip -l "$OUT"
