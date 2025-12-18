#!/bin/bash
set -e

APP_DIR="/home/ubuntu/app"
NODE="/usr/bin/node"
NPM="/usr/bin/npm"

cd "$APP_DIR"

# 실행 환경 확인 (로그용)
$NODE -v
$NPM -v

# 혹시 남아 있는 프로세스 정리
pkill -f "next start" || true

# Next.js 실행
nohup $NPM run start > app.log 2>&1 &

exit 0
