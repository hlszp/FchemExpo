#!/usr/bin/env bash
# 致联信息 · 展会扫码页 / 电子手册 / 留资服务 一键部署
# 用法：bash deploy-expo.sh
set -euo pipefail
cd "$(dirname "$0")"

HOST=101.200.186.149
PORT=22334
USER=root
# ⚠️ 密码不硬编码 —— 本仓库在 GitHub 上是公开的，硬编码密码曾因此泄露。
# 从 .secrets/deploy.env 读取（已 gitignore），内容一行：DEPLOY_PASS=服务器root密码
if [ -f .secrets/deploy.env ]; then
  # shellcheck disable=SC1091
  . ./.secrets/deploy.env
fi
PASS="${DEPLOY_PASS:-${ZLINFOT_DEPLOY_PASS:-}}"
if [ -z "$PASS" ]; then
  echo "缺少部署密码。创建 .secrets/deploy.env（内容为 DEPLOY_PASS=...），或 export ZLINFOT_DEPLOY_PASS=..."
  exit 1
fi
SSH="sshpass -p $PASS ssh -p $PORT -o StrictHostKeyChecking=no -o ConnectTimeout=15"
SCP="sshpass -p $PASS scp -P $PORT -o StrictHostKeyChecking=no"
REMOTE_WEB=/opt/zlinfot-web/current
REMOTE_APP=/opt/zlinfot-lead

say() { printf '\n\033[1;33m▸ %s\033[0m\n' "$1"; }

# ── 0. 导出令牌（只需生成一次，之后复用）──
mkdir -p .secrets
if [ ! -f .secrets/lead-token.txt ]; then
  openssl rand -hex 16 > .secrets/lead-token.txt
  chmod 600 .secrets/lead-token.txt
fi
LEAD_TOKEN=$(cat .secrets/lead-token.txt)

# ── 1. 构建 ──
say "构建页面"
node build.mjs
node build-expo.mjs
node build-manual.mjs
node build-download.mjs

[ -f assets/manual/zl-manual-2026-a7f3.pdf ] || { echo "缺少 PDF，先跑 pdf 生成"; exit 1; }
[ -f download/zl-compendium-2026.pdf ] || { echo "缺少定稿合订本 PDF"; exit 1; }

# ── 2. 整理发布产物（整站，不做增量合并）──
say "整理发布产物"
rm -rf dist
mkdir -p dist
cp index.html 404.html robots.txt sitemap.xml dist/
cp -R assets dist/
cp -R expo manual demo dist/
# 高仿真系统（iMCS / iAAS / iPAE / iCLPM）
SIM_DIR="$PWD/../../../08_演示系统/08_高仿真系统"
if [ -d "$SIM_DIR" ]; then
  mkdir -p dist/demo/app
  for SIM in _shared imcs iaas ipae iclpm chain inwork ai-config iacms scenarios; do
    [ -d "$SIM_DIR/$SIM" ] && cp -R "$SIM_DIR/$SIM" dist/demo/app/
  done
fi
mkdir -p dist/download
mv dist/assets/manual/zl-manual-2026-a7f3.pdf dist/download/
cp -R download/. dist/download/
rmdir dist/assets/manual 2>/dev/null || true
# 清掉 macOS 元数据
find dist -name '._*' -delete 2>/dev/null || true
find dist -name '.DS_Store' -delete 2>/dev/null || true
echo "dist 大小: $(du -sh dist | cut -f1)  文件数: $(find dist -type f | wc -l | tr -d ' ')"

COPYFILE_DISABLE=1 tar czf /tmp/zlinfot-expo.tgz -C dist .

# ── 3. 上传 ──
say "上传静态产物"
$SCP /tmp/zlinfot-expo.tgz $USER@$HOST:/tmp/
$SCP server/lead.mjs $USER@$HOST:/tmp/lead.mjs
$SCP nginx-www.zlinfot.com.conf $USER@$HOST:/tmp/nginx-www.zlinfot.com.conf.new

# ── 4. 远端部署 ──
say "远端部署"
$SSH $USER@$HOST "bash -s" <<REMOTE
set -euo pipefail

# 4.1 静态文件（整站清空后覆盖，避免旧版深色主题残留）
mkdir -p $REMOTE_WEB
find $REMOTE_WEB -mindepth 1 -delete
tar xzf /tmp/zlinfot-expo.tgz -C $REMOTE_WEB
chown -R root:root $REMOTE_WEB
chmod -R a+rX $REMOTE_WEB
echo "  static ok: \$(ls $REMOTE_WEB | tr '\n' ' ')"
echo "  files: \$(find $REMOTE_WEB -type f | wc -l)"

# 4.2 留资服务
mkdir -p $REMOTE_APP/data
cp /tmp/lead.mjs $REMOTE_APP/lead.mjs
chmod 700 $REMOTE_APP/data

cat > /etc/systemd/system/zlinfot-lead.service <<'UNIT'
[Unit]
Description=Zlinfot Expo Lead Service
After=network.target

[Service]
Type=simple
WorkingDirectory=/opt/zlinfot-lead
Environment=PORT=8097
Environment=DATA_DIR=/opt/zlinfot-lead/data
Environment=MANUAL_PDF=/download/zl-manual-2026-a7f3.pdf
Environment=LEAD_TOKEN=${LEAD_TOKEN}
ExecStart=/opt/node-v22.20.0-glibc217/bin/node /opt/zlinfot-lead/lead.mjs
Restart=always
RestartSec=3
User=nginx
Group=nginx
NoNewPrivileges=true
PrivateTmp=true

[Install]
WantedBy=multi-user.target
UNIT

chown -R nginx:nginx $REMOTE_APP
systemctl daemon-reload
systemctl enable zlinfot-lead >/dev/null 2>&1
systemctl restart zlinfot-lead
sleep 1.2
systemctl is-active zlinfot-lead

# 4.3 nginx
if ! diff -q /tmp/nginx-www.zlinfot.com.conf.new /etc/nginx/conf.d/nginx-www.zlinfot.com.conf >/dev/null 2>&1; then
  cp /etc/nginx/conf.d/nginx-www.zlinfot.com.conf /tmp/nginx-www.zlinfot.com.conf.bak.\$(date +%s)
  cp /tmp/nginx-www.zlinfot.com.conf.new /etc/nginx/conf.d/nginx-www.zlinfot.com.conf
fi
nginx -t
systemctl reload nginx
echo "  nginx reloaded"
REMOTE

# ── 5. 验证 ──
say "线上验证"
echo -n "  /               "; curl -s -o /dev/null -w "%{http_code}\n" https://www.zlinfot.com/
echo -n "  /expo/          "; curl -s -o /dev/null -w "%{http_code}\n" https://www.zlinfot.com/expo/
echo -n "  /manual/        "; curl -s -o /dev/null -w "%{http_code}\n" https://www.zlinfot.com/manual/
echo -n "  /404            "; curl -s -o /dev/null -w "%{http_code}\n" https://www.zlinfot.com/no-such-page
echo -n "  /robots.txt     "; curl -s -o /dev/null -w "%{http_code}\n" https://www.zlinfot.com/robots.txt
echo -n "  /sitemap.xml    "; curl -s -o /dev/null -w "%{http_code}\n" https://www.zlinfot.com/sitemap.xml
echo -n "  /assets/hero    "; curl -s -o /dev/null -w "%{http_code} %{size_download}\n" https://www.zlinfot.com/assets/hero/factory-sm.jpg
echo -n "  /assets/brand   "; curl -s -o /dev/null -w "%{http_code}\n" https://www.zlinfot.com/assets/brand/logo.svg
echo -n "  /download/      "; curl -s -o /dev/null -w "%{http_code}\n" https://www.zlinfot.com/download/
echo -n "  compendium.pdf  "; curl -s -o /dev/null -w "%{http_code} %{size_download}\n" https://www.zlinfot.com/download/zl-compendium-2026.pdf
echo -n "  qr-service.png  "; curl -s -o /dev/null -w "%{http_code} %{size_download}\n" https://www.zlinfot.com/assets/qr-service.png
echo -n "  /api/health     "; curl -s https://www.zlinfot.com/api/health; echo

echo
echo "导出令牌：$LEAD_TOKEN"
echo "  统计  https://www.zlinfot.com/api/lead/stats?k=$LEAD_TOKEN"
echo "  导出  https://www.zlinfot.com/api/lead/export.csv?k=$LEAD_TOKEN"
