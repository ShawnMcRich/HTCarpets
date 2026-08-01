#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RENDERER="${PROJECT_DIR}/docs/liquid-glass-carousel-proof-v2.html"
OUTPUT_DIR="${PROJECT_DIR}/public/media/carousel-info-v2"
DRIVER_PORT="4462"
DRIVER_URL="http://127.0.0.1:${DRIVER_PORT}"
DRIVER_LOG="/tmp/htcarpets-liquid-glass-v2-geckodriver.log"

SKUS=(
  HT-KSH-0001 HT-KHY-0001 HT-KRM-0001 HT-NHV-0001 HT-RVR-0001
  HT-QOM-0001 HT-QOM-0002 HT-QOM-0003 HT-KSH-0002 HT-ISF-0001
  HT-ISF-0002 HT-SRJ-0001 HT-SNH-0001 HT-NJF-0001 HT-BJR-0001
  HT-KSH-0003 HT-QOM-0004 HT-SHB-0001 HT-TBZ-0001 HT-KSH-0004
)

cleanup() {
  if [[ -n "${SESSION_ID:-}" ]]; then
    curl -sS -X DELETE "${DRIVER_URL}/session/${SESSION_ID}" >/dev/null 2>&1 || true
  fi
  if [[ -n "${DRIVER_PID:-}" ]]; then
    kill "${DRIVER_PID}" >/dev/null 2>&1 || true
  fi
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
  --data '{"width":1080,"height":1436,"x":0,"y":0}' \
  "${DRIVER_URL}/session/${SESSION_ID}/window/rect" >/dev/null

for sku in "${SKUS[@]}"; do
  slug="$(tr '[:upper:]' '[:lower:]' <<<"${sku}")"
  page_url="file://${RENDERER}?sku=${sku}"
  jq -cn --arg url "${page_url}" '{url:$url}' | curl -sS -X POST -H 'Content-Type: application/json' --data-binary @- "${DRIVER_URL}/session/${SESSION_ID}/url" >/dev/null

  READY_PAYLOAD='{"script":"const scene=document.getElementById(\"scene\"); const logo=document.getElementById(\"brand-logo\"); const cards=[...document.querySelectorAll(\".fact\")]; return {scene:Boolean(scene&&scene.complete&&scene.naturalWidth),logo:Boolean(logo&&logo.complete&&logo.naturalWidth),overflow:cards.some(card=>card.scrollHeight>card.clientHeight||card.scrollWidth>card.clientWidth),count:cards.length,width:innerWidth,height:innerHeight};","args":[]}'
  READY_RESPONSE="$(curl -sS -X POST -H 'Content-Type: application/json' --data "${READY_PAYLOAD}" "${DRIVER_URL}/session/${SESSION_ID}/execute/sync")"
  if [[ "$(jq -r '.value.scene and .value.logo' <<<"${READY_RESPONSE}")" != "true" ]]; then
    echo "Source asset did not load for ${sku}" >&2
    exit 1
  fi
  if [[ "$(jq -r '.value.overflow' <<<"${READY_RESPONSE}")" != "false" ]]; then
    echo "Text overflow detected for ${sku}" >&2
    exit 1
  fi
  if [[ "$(jq -r '.value.width == 1080 and .value.height == 1350' <<<"${READY_RESPONSE}")" != "true" ]]; then
    echo "Unexpected viewport for ${sku}" >&2
    jq '.value' <<<"${READY_RESPONSE}" >&2
    exit 1
  fi

  SCREENSHOT_RESPONSE="$(curl -sS "${DRIVER_URL}/session/${SESSION_ID}/screenshot")"
  jq -r '.value' <<<"${SCREENSHOT_RESPONSE}" | base64 --decode >"${OUTPUT_DIR}/${slug}-liquid-glass-info-v2.png"
  echo "Generated ${slug}-liquid-glass-info-v2.png"
done

echo "Generated ${#SKUS[@]} art-directed liquid-glass carousel slides in ${OUTPUT_DIR}"
