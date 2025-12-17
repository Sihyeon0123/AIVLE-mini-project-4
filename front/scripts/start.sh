#!/bin/bash
set -e

APP_DIR=/home/ubuntu/app

cd $APP_DIR

# (선택) 기존 프로세스 정리 — 없어도 에러 안 나게
pm2 delete front || true

# 운영 환경에서는 build 결과를 쓰므로 install은 보통 불필요
# 만약 꼭 필요하다면 남겨도 됨
npm install --omit=dev

# Next.js 실행
pm2 start npm --name "front" -- start

# 재부팅 시 자동 복구
pm2 save
