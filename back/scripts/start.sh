#!/bin/bash
set -e

APP_DIR=/home/ubuntu/app
LOG_FILE="$APP_DIR/app.log"

cd "$APP_DIR"

echo "=== Cleanup old artifacts (remove plain.war) ==="
rm -f *-plain.war || true

echo "=== Stop existing app ==="
PID=$(pgrep -f 'java.*\.war' || true)
if [ -n "$PID" ]; then
  echo "Found PID: $PID"
  kill -15 $PID || true

  # 최대 20초 정도 정상 종료 기다림
  for i in {1..20}; do
    if ps -p "$PID" >/dev/null 2>&1; then
      sleep 1
    else
      break
    fi
  done

  # 아직 살아있으면 강제 종료
  if ps -p "$PID" >/dev/null 2>&1; then
    echo "Force kill PID: $PID"
    kill -9 "$PID" || true
  fi
fi

echo "=== Find executable WAR (exclude plain.war) ==="
WAR_FILE=$(ls -1 *.war 2>/dev/null | grep -v -- '-plain\.war$' | head -n 1 || true)

if [ -z "$WAR_FILE" ]; then
  echo "❌ Executable WAR not found (plain.war excluded)"
  echo "Current files:"
  ls -al
  exit 1
fi

echo "=== Start application: $WAR_FILE ==="
nohup java -jar "$WAR_FILE" > "$LOG_FILE" 2>&1 &

sleep 1
echo "Started. Last 30 lines of log:"
tail -n 30 "$LOG_FILE" || true
