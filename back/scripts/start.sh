#!/bin/bash

APP_DIR=/home/ubuntu/app
cd $APP_DIR || exit 1

echo "==== DEBUG START ====" >> debug.log
date >> debug.log
whoami >> debug.log
pwd >> debug.log
env >> debug.log
which java >> debug.log
java -version >> debug.log 2>&1
ls -al >> debug.log
echo "==== DEBUG END ====" >> debug.log

PID=$(pgrep -f '.war' || true)
if [ -n "$PID" ]; then
  kill -15 $PID
  sleep 5
fi

WAR_FILE=$(ls *.war | head -n 1)

/usr/bin/java -jar "$WAR_FILE" >> app.log 2>&1 &
