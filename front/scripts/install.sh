#!/bin/bash
set -e

APP_DIR="/home/ubuntu/app/front"
NPM="/usr/bin/npm"

cd "$APP_DIR"
$NPM ci
