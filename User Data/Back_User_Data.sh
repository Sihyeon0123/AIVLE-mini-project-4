#!/bin/bash
set -e

#################################
# 기본 설정
#################################
apt-get update -y
apt-get upgrade -y

#################################
# 필수 패키지
#################################
apt-get install -y curl git wget unzip

#################################
# Java 17 설치 (Spring Boot 권장)
#################################
apt-get install -y openjdk-17-jdk

java -version

#################################
# 타임존 설정
#################################
timedatectl set-timezone Asia/Seoul

#################################
# CodeDeploy Agent 설치
#################################
apt-get install -y ruby

cd /home/ubuntu
wget https://aws-codedeploy-ap-northeast-2.s3.ap-northeast-2.amazonaws.com/latest/install
chmod +x install
./install auto

systemctl enable codedeploy-agent
systemctl start codedeploy-agent

#################################
# 배포 디렉토리
#################################
mkdir -p /home/ubuntu/app
chown -R ubuntu:ubuntu /home/ubuntu/app

#################################
# 로그 디렉토리
#################################
mkdir -p /var/log/spring
chown -R ubuntu:ubuntu /var/log/spring


echo "Backend EC2 User Data setup completed"
