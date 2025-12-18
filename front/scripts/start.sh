#!/bin/bash
set -e

cd /home/ubuntu/app

# pm2 없으면 실패하므로 안전 처리
if ! command -v pm2 >/dev/null 2>&1; then
  npm install -g pm2
fi

# 기존 프로세스 있으면 재시작, 없으면 시작
pm2 start ecosystem.config.js --env production || pm2 restart ecosystem.config.js

pm2 save
