#!/usr/bin/env bash
# Package a game directory as an itch.io HTML5 upload.
#
# itch.io wants index.html at the root of the zip. Any library the page pulls
# from a CDN is inlined from vendor/ on the way in, so the upload plays even
# where the CDN is blocked or the player is offline.
#
#   ./build-itch.sh agent64-facility
set -euo pipefail
GAME="${1:?usage: ./build-itch.sh <game-directory>}"
GAME="${GAME%/}"
[ -f "$GAME/index.html" ] || { echo "no $GAME/index.html" >&2; exit 1; }

ROOT="$(cd "$(dirname "$0")" && pwd)"
OUT="$ROOT/dist/$GAME.zip"
STAGE="$(mktemp -d)"
trap 'rm -rf "$STAGE"' EXIT

cp -R "$ROOT/$GAME/." "$STAGE/"
rm -f "$STAGE"/*.md

python3 - "$STAGE/index.html" "$ROOT/vendor" <<'PY'
import os, re, sys
page, vendor = sys.argv[1], sys.argv[2]
html = open(page, encoding="utf-8").read()

# vendor/<name>.js is matched against the tail of each CDN script URL
local = {}
for f in sorted(os.listdir(vendor)):
    if f.endswith(".js"):
        local[f.split(".")[0].lower()] = os.path.join(vendor, f)

def inline(m):
    url = m.group(1)
    if not url.startswith("http"):
        return m.group(0)
    key = next((k for k in local if k in url.lower()), None)
    if key is None:
        raise SystemExit("no vendored copy for " + url)
    lib = open(local[key], encoding="utf-8").read()
    if "</script" in lib:
        raise SystemExit("cannot inline " + local[key] + ": contains </script")
    print("  inlined %s (%d KB) <- %s" % (key, len(lib) // 1024, url))
    return "<script>/* %s */\n%s\n</script>" % (url, lib)

html, n = re.subn(r'<script\s+src="([^"]+)"\s*></script>', inline, html)
if n == 0:
    print("  no external scripts")
open(page, "w", encoding="utf-8").write(html)
PY

mkdir -p "$ROOT/dist"
rm -f "$OUT"
( cd "$STAGE" && zip -q -r -X "$OUT" . -x '.*' '__MACOSX/*' )
echo "$OUT"
unzip -l "$OUT" | tail -5
