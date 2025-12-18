#!/bin/bash
set -e

APP_DIR=/home/ubuntu/app
PORT=3000

echo "=== stop existing next-server ==="
pkill -9 -f next-server || true
pkill -9 -f server.js || true

sleep 2

echo "=== check port ==="
if ss -tlnp | grep -q ":${PORT}"; then
  echo "❌ port ${PORT} still in use"
  ss -tlnp | grep ${PORT}
  exit 1
fi

echo "=== start next.js standalone ==="
cd ${APP_DIR}

export NODE_ENV=production
export PORT=3000

# ★ 절대 & 붙이지 마세요
node .next/standalone/server.js
