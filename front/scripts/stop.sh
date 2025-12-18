#!/bin/bash
set -e

APP_DIR="/home/ubuntu/app"

cd "$APP_DIR"

# 실행 중인 Next.js 종료
pkill -f "next start" || true

exit 0
