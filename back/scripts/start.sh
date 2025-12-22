#!/bin/bash
set -e

APP_DIR=/home/ubuntu/app
LOG_FILE=$APP_DIR/app.log

cd $APP_DIR

echo "=== Stop existing app ==="
PID=$(pgrep -f 'java.*\.war' || true)
if [ -n "$PID" ]; then
  kill -15 $PID
  sleep 5
fi

echo "=== Find executable WAR ==="
WAR_FILE=$(ls *.war | grep -v plain | head -n 1)

if [ -z "$WAR_FILE" ]; then
  echo "❌ Executable WAR not found"
  ls -l
  exit 1
fi

echo "=== Start application: $WAR_FILE ==="
nohup java -jar "$WAR_FILE" > "$LOG_FILE" 2>&1 &
