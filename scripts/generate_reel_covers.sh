#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RENDERER="${PROJECT_DIR}/docs/reel-cover-renderer.html"
OUTPUT_DIR="${PROJECT_DIR}/public/media/reel-covers"
DRIVER_PORT="4451"
DRIVER_URL="http://127.0.0.1:${DRIVER_PORT}"
DRIVER_LOG="$(mktemp)"

DEFAULT_SKUS=(
  HT-KSH-0001 HT-KHY-0001 HT-KRM-0001 HT-NHV-0001 HT-RVR-0001
  HT-QOM-0001 HT-QOM-0002 HT-QOM-0003 HT-KSH-0002 HT-ISF-0001
  HT-ISF-0002 HT-SRJ-0001 HT-SNH-0001 HT-NJF-0001 HT-BJR-0001
  HT-KSH-0003 HT-QOM-0004 HT-SHB-0001 HT-TBZ-0001 HT-KSH-0004
)

if (( $# > 0 )); then
  SKUS=("$@")
else
  SKUS=("${DEFAULT_SKUS[@]}")
fi

cleanup() {
  if [[ -n "${SESSION_ID:-}" ]]; then
    curl -sS -X DELETE "${DRIVER_URL}/session/${SESSION_ID}" >/dev/null 2>&1 || true
  fi
  if [[ -n "${DRIVER_PID:-}" ]]; then
    kill "${DRIVER_PID}" >/dev/null 2>&1 || true
  fi
  rm -f "${DRIVER_LOG}"
}
trap cleanup EXIT

mkdir -p "${OUTPUT_DIR}"

FIREFOX_BINARY="/snap/firefox/current/usr/lib/firefox/firefox"
if [[ ! -x "${FIREFOX_BINARY}" ]]; then
  FIREFOX_BINARY="$(command -v firefox)"
fi

GECKODRIVER="$(command -v geckodriver)"
"${GECKODRIVER}" --port "${DRIVER_PORT}" --binary "${FIREFOX_BINARY}" --log error >"${DRIVER_LOG}" 2>&1 &
DRIVER_PID=$!

for _ in {1..40}; do
  if curl -sS "${DRIVER_URL}/status" >/dev/null 2>&1; then
    break
  fi
  sleep 0.25
done

SESSION_PAYLOAD='{"capabilities":{"alwaysMatch":{"browserName":"firefox","acceptInsecureCerts":true,"moz:firefoxOptions":{"args":["-headless"]}}}}'
SESSION_RESPONSE="$(curl -sS -X POST -H 'Content-Type: application/json' --data "${SESSION_PAYLOAD}" "${DRIVER_URL}/session")"
SESSION_ID="$(jq -r '.value.sessionId // .sessionId // empty' <<<"${SESSION_RESPONSE}")"

if [[ -z "${SESSION_ID}" ]]; then
  jq . <<<"${SESSION_RESPONSE}" >&2
  exit 1
fi

curl -sS -X POST -H 'Content-Type: application/json' \
  --data '{"width":1080,"height":2006,"x":0,"y":0}' \
  "${DRIVER_URL}/session/${SESSION_ID}/window/rect" >/dev/null

for sku in "${SKUS[@]}"; do
  slug="$(tr '[:upper:]' '[:lower:]' <<<"${sku}")"
  page_url="file://${RENDERER}?sku=${sku}"
  jq -cn --arg url "${page_url}" '{url:$url}' | curl -sS -X POST -H 'Content-Type: application/json' --data-binary @- "${DRIVER_URL}/session/${SESSION_ID}/url" >/dev/null

  READY_PAYLOAD='{"script":"const image=document.getElementById(\"carpet\"); return {ready:document.readyState, loaded:Boolean(image && image.complete && image.naturalWidth), width:window.innerWidth, height:window.innerHeight};","args":[]}'
  READY_RESPONSE="$(curl -sS -X POST -H 'Content-Type: application/json' --data "${READY_PAYLOAD}" "${DRIVER_URL}/session/${SESSION_ID}/execute/sync")"
  if [[ "$(jq -r '.value.loaded' <<<"${READY_RESPONSE}")" != "true" ]]; then
    echo "Source image did not load for ${sku}" >&2
    exit 1
  fi

  SCREENSHOT_RESPONSE="$(curl -sS "${DRIVER_URL}/session/${SESSION_ID}/screenshot")"
  jq -r '.value' <<<"${SCREENSHOT_RESPONSE}" | base64 --decode >"${OUTPUT_DIR}/${slug}-reel-cover.png"
  echo "Generated ${slug}-reel-cover.png"
done

echo "Generated ${#SKUS[@]} Reel covers in ${OUTPUT_DIR}"
