#!/bin/bash
set -e

APP_DIR=/home/ubuntu/app/back
cd $APP_DIR

# 기존 실행 중인 프로세스 종료 (있으면)
PID=$(pgrep -f '.war' || true)
if [ -n "$PID" ]; then
  kill -15 $PID
  sleep 5
fi

# WAR 파일 하나 선택 (bootWar 기준)
WAR_FILE=$(ls *.war | head -n 1)

# 백그라운드 실행
nohup java -jar "$WAR_FILE" > app.log 2>&1 &
