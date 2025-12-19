#!/bin/bash
set -e

timedatectl set-timezone Asia/Seoul

apt-get update -y
apt-get upgrade -y
apt-get install -y curl git wget unzip

curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

node -v
npm -v

npm install -g pm2

apt-get install -y ruby
cd /home/ubuntu
wget https://aws-codedeploy-ap-northeast-2.s3.ap-northeast-2.amazonaws.com/latest/install
chmod +x install
./install auto

systemctl enable codedeploy-agent
systemctl start codedeploy-agent

apt-get install -y nginx

# sites-enabled 비어있는 문제 방지
rm -f /etc/nginx/sites-enabled/*

# 요청하신 nginx 설정 그대로 포함
cat <<'EOF' > /etc/nginx/sites-available/default
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    server_name _;

    location /_next/ {
        proxy_pass http://localhost:3000/_next/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location ^~ /api/ {
        proxy_pass http://10.0.2.205:8080/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# default 활성화
ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default

nginx -t
systemctl restart nginx
systemctl enable nginx

mkdir -p /home/ubuntu/app
chown -R ubuntu:ubuntu /home/ubuntu/app

pm2 startup systemd -u ubuntu --hp /home/ubuntu

echo "Front EC2 User Data setup completed"
