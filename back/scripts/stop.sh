#!/bin/bash
set -e

PID=$(pgrep -f '.war' || true)
if [ -n "$PID" ]; then
  kill -15 $PID
  sleep 5
fi
