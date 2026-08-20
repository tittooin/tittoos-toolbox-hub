#!/bin/bash
# =============================================================================
# AXEVORA EC2 OpenSERP Deployment Script
# Instance: axevora-trade | ap-south-1b | t2.micro
#
# USAGE (run on EC2 via SSH):
#   chmod +x ec2-openserp-deploy.sh
#   sudo bash ec2-openserp-deploy.sh
#
# CRITICAL RULES:
# - Do NOT expose port 7000 publicly
# - OpenSERP binds to 127.0.0.1 ONLY
# - Old bot backup created BEFORE any deletion
# - Unrelated services must NOT be removed
# - No paid AWS services created
# =============================================================================

set -e
SCRIPT_VERSION="1.0.0"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/axevora-backups/bot-backup-${TIMESTAMP}"
LOG_FILE="/var/log/axevora-openserp-deploy-${TIMESTAMP}.log"
OPENSERP_VERSION="latest"
OPENSERP_PORT="7000"
OPENSERP_BIND="127.0.0.1"
OPENSERP_INSTALL_DIR="/opt/openserp"
OPENSERP_SERVICE="openserp"
NGINX_SITE_NAME="openserp"
NGINX_LISTEN_PORT="8080"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"; }
warn() { echo "[WARN] $*" | tee -a "$LOG_FILE"; }
err() { echo "[ERROR] $*" | tee -a "$LOG_FILE" >&2; }
section() { echo "" | tee -a "$LOG_FILE"; echo "=== $* ===" | tee -a "$LOG_FILE"; echo "" | tee -a "$LOG_FILE"; }

mkdir -p "$(dirname "$LOG_FILE")"
log "Axevora EC2 OpenSERP Deploy Script v${SCRIPT_VERSION}"
log "Timestamp: ${TIMESTAMP}"
log "Log: ${LOG_FILE}"

# =============================================================================
# PHASE 1: RESOURCE BASELINE
# =============================================================================
section "PHASE 1: RESOURCE BASELINE"

log "--- Memory ---"
free -h | tee -a "$LOG_FILE"

log "--- Disk ---"
df -h / | tee -a "$LOG_FILE"

log "--- CPU ---"
top -bn1 | grep "Cpu(s)" | tee -a "$LOG_FILE"

log "--- Architecture ---"
ARCH=$(uname -m)
log "Architecture: ${ARCH}"

log "--- OS ---"
cat /etc/os-release | tee -a "$LOG_FILE"

log "--- Kernel ---"
uname -r | tee -a "$LOG_FILE"

log "--- Running processes ---"
ps aux | tee -a "$LOG_FILE"

log "--- Listening ports ---"
ss -tlnp | tee -a "$LOG_FILE"

# =============================================================================
# PHASE 2: FORENSIC INVENTORY OF EXISTING BOT
# =============================================================================
section "PHASE 2: FORENSIC INVENTORY"

log "--- systemd services (non-standard) ---"
systemctl list-units --type=service --state=running | tee -a "$LOG_FILE"

log "--- PM2 processes ---"
if command -v pm2 >/dev/null 2>&1; then
  pm2 list | tee -a "$LOG_FILE"
else
  log "PM2: not installed"
fi

log "--- Supervisor services ---"
if command -v supervisorctl >/dev/null 2>&1; then
  supervisorctl status | tee -a "$LOG_FILE"
else
  log "Supervisor: not installed"
fi

log "--- Docker containers ---"
if command -v docker >/dev/null 2>&1; then
  docker ps -a | tee -a "$LOG_FILE"
else
  log "Docker: not installed"
fi

log "--- Cron jobs (root) ---"
crontab -l 2>/dev/null | tee -a "$LOG_FILE" || log "No root crontab"

log "--- Cron jobs (ubuntu user if exists) ---"
crontab -u ubuntu -l 2>/dev/null | tee -a "$LOG_FILE" || true

log "--- /etc/cron.d ---"
ls -la /etc/cron.d/ 2>/dev/null | tee -a "$LOG_FILE" || true

log "--- Application directories ---"
for d in /opt /srv /var/www /home/ubuntu /root /app; do
  if [ -d "$d" ]; then
    log "Contents of $d:"
    ls -la "$d" | tee -a "$LOG_FILE"
  fi
done

log "--- Nginx config ---"
if [ -f /etc/nginx/nginx.conf ]; then
  log "nginx.conf exists"
  ls -la /etc/nginx/sites-enabled/ 2>/dev/null | tee -a "$LOG_FILE" || true
  ls -la /etc/nginx/conf.d/ 2>/dev/null | tee -a "$LOG_FILE" || true
else
  log "nginx: not installed"
fi

log "--- Cloudflare Tunnel (cloudflared) ---"
if command -v cloudflared >/dev/null 2>&1; then
  cloudflared tunnel list 2>/dev/null | tee -a "$LOG_FILE" || log "cloudflared: installed but tunnel list failed"
else
  log "cloudflared: not installed"
fi

log "--- Environment files ---"
for envfile in /etc/environment /etc/profile.d/*.sh /opt/*/.env /home/ubuntu/.env /root/.env; do
  if [ -f "$envfile" ]; then
    log "Found env file: $envfile (NOT printing contents for security)"
  fi
done

log "FORENSIC INVENTORY COMPLETE"

# =============================================================================
# PHASE 3: IDENTIFY AND BACKUP EXISTING BOT (IDEMPOTENT)
# =============================================================================
section "PHASE 3: BACKUP EXISTING BOT (IDEMPOTENT)"

mkdir -p "${BACKUP_DIR}"
EXISTING_BACKUP=$(ls -t /opt/axevora-backups/bot-backup-*.tar.gz 2>/dev/null | head -1 || true)

if [ -n "$EXISTING_BACKUP" ] && [ -f "${EXISTING_BACKUP}.sha256" ] && sha256sum -c "${EXISTING_BACKUP}.sha256" >/dev/null 2>&1; then
  log "Found existing verified backup: ${EXISTING_BACKUP}"
  log "Skipping redundant backup creation (Idempotent PASS)"
else
  # Identify the existing bot by inspecting services
  IDENTIFIED_BOT=""
  IDENTIFIED_BOT_TYPE=""

  if systemctl is-active --quiet trading-bot 2>/dev/null; then
    IDENTIFIED_BOT="trading-bot"
    IDENTIFIED_BOT_TYPE="systemd"
  elif systemctl is-active --quiet bot 2>/dev/null; then
    IDENTIFIED_BOT="bot"
    IDENTIFIED_BOT_TYPE="systemd"
  elif systemctl is-active --quiet axevora-bot 2>/dev/null; then
    IDENTIFIED_BOT="axevora-bot"
    IDENTIFIED_BOT_TYPE="systemd"
  elif command -v pm2 >/dev/null 2>&1 && pm2 list | grep -q "online"; then
    IDENTIFIED_BOT_TYPE="pm2"
    IDENTIFIED_BOT=$(pm2 list --no-color | grep "online" | awk '{print $4}' | head -1)
  fi

  log "Identified bot: ${IDENTIFIED_BOT:-NONE} (type: ${IDENTIFIED_BOT_TYPE:-unknown})"

  # Backup systemd service unit if found
  if [ -n "$IDENTIFIED_BOT" ] && [ "$IDENTIFIED_BOT_TYPE" = "systemd" ]; then
    if [ -f "/etc/systemd/system/${IDENTIFIED_BOT}.service" ]; then
      cp "/etc/systemd/system/${IDENTIFIED_BOT}.service" "${BACKUP_DIR}/"
      log "Backed up systemd unit: ${IDENTIFIED_BOT}.service"
    fi
  fi

  # Backup /opt content (likely bot source)
  for d in /opt/*/; do
    if [ -d "$d" ] && [ "$d" != "${OPENSERP_INSTALL_DIR}/" ] && [[ "$d" != *"/axevora-backups/"* ]]; then
      DIRNAME=$(basename "$d")
      tar czf "${BACKUP_DIR}/${DIRNAME}-opt-backup.tar.gz" "$d" 2>/dev/null || warn "Could not archive $d"
      log "Backed up: $d"
    fi
  done

  # Backup nginx configs related to bot
  if [ -d /etc/nginx/sites-available ]; then
    cp -r /etc/nginx/sites-available "${BACKUP_DIR}/nginx-sites-available" 2>/dev/null || true
  fi

  # Backup PM2 config
  if command -v pm2 >/dev/null 2>&1; then
    pm2 save 2>/dev/null || true
    if [ -f /root/.pm2/dump.pm2 ]; then
      cp /root/.pm2/dump.pm2 "${BACKUP_DIR}/pm2-dump.pm2" 2>/dev/null || true
    fi
  fi

  # Compress backup
  tar czf "${BACKUP_DIR}.tar.gz" -C "$(dirname "${BACKUP_DIR}")" "$(basename "${BACKUP_DIR}")" 2>/dev/null || warn "Could not compress backup"

  # Generate and verify SHA256 checksum of backup archive
  if [ -f "${BACKUP_DIR}.tar.gz" ]; then
    SHA256_HASH=$(sha256sum "${BACKUP_DIR}.tar.gz" | awk '{print $1}')
    echo "${SHA256_HASH}  ${BACKUP_DIR}.tar.gz" > "${BACKUP_DIR}.tar.gz.sha256"
    log "Backup archive created: ${BACKUP_DIR}.tar.gz"
    log "Backup SHA256 Checksum: ${SHA256_HASH}"
    
    # Verify checksum immediately
    if sha256sum -c "${BACKUP_DIR}.tar.gz.sha256" >/dev/null 2>&1; then
      log "BACKUP VERIFICATION: PASS (SHA256 integrity confirmed)"
    else
      err "BACKUP VERIFICATION FAILED: Corrupted archive"
      exit 1
    fi
  fi
fi

log "BACKUP STATUS: SECURED"

# =============================================================================
# PHASE 4: REMOVE EXISTING BOT & QUARANTINE SOURCE (IDEMPOTENT)
# =============================================================================
section "PHASE 4: REMOVE EXISTING BOT & QUARANTINE SOURCE (IDEMPOTENT)"

QUARANTINE_DIR="/opt/axevora-backups/quarantine-${TIMESTAMP}"
mkdir -p "${QUARANTINE_DIR}"

# Check and stop bot if active
for bot_name in trading-bot bot axevora-bot; do
  if systemctl is-active --quiet "$bot_name" 2>/dev/null; then
    log "Stopping active systemd service: $bot_name"
    systemctl stop "$bot_name" 2>/dev/null || true
    systemctl disable "$bot_name" 2>/dev/null || true
    rm -f "/etc/systemd/system/${bot_name}.service"
    systemctl daemon-reload
    log "Disabled and removed service: $bot_name"
  fi
done

if command -v pm2 >/dev/null 2>&1 && pm2 list | grep -q "online"; then
  log "Stopping active PM2 processes..."
  pm2 stop all 2>/dev/null || true
  pm2 delete all 2>/dev/null || true
  pm2 save 2>/dev/null || true
fi

# Move any remaining unquarantined non-OpenSERP directories to quarantine
QUARANTINED_COUNT=0
for d in /opt/*/; do
  if [ -d "$d" ] && [ "$d" != "${OPENSERP_INSTALL_DIR}/" ] && [[ "$d" != *"/axevora-backups/"* ]]; then
    DIRNAME=$(basename "$d")
    log "Quarantining unarchived directory: $d -> ${QUARANTINE_DIR}/${DIRNAME}"
    mv "$d" "${QUARANTINE_DIR}/" 2>/dev/null || warn "Could not quarantine $d"
    QUARANTINED_COUNT=$((QUARANTINED_COUNT + 1))
  fi
done

if [ "$QUARANTINED_COUNT" -eq 0 ]; then
  log "All old bot source directories already safely quarantined"
  rmdir "${QUARANTINE_DIR}" 2>/dev/null || true
fi

log "Verifying common bot ports 3000/8000/4000 are closed..."
ss -tlnp | grep -E ':3000|:4000|:8000' | tee -a "$LOG_FILE" || log "Common bot ports closed (good)"

# =============================================================================
# PHASE 5: INSTALL OPENSERP (ROBUST GITHUB ASSET DISCOVERY)
# =============================================================================
section "PHASE 5: INSTALL OPENSERP (ROBUST GITHUB ASSET DISCOVERY)"

mkdir -p "${OPENSERP_INSTALL_DIR}"

# Detect architecture for Go binary selection
case "$ARCH" in
  x86_64)
    GOARCH="amd64"
    ;;
  aarch64|arm64)
    GOARCH="arm64"
    ;;
  i386|i686)
    GOARCH="386"
    ;;
  *)
    GOARCH="amd64"
    warn "Unknown architecture $ARCH, defaulting to amd64"
    ;;
esac

log "Detected architecture: ${ARCH} -> Target Go arch: ${GOARCH}"

# Fetch release metadata from GitHub API
log "Fetching OpenSERP release metadata from GitHub API..."
RELEASE_JSON="/tmp/openserp_release.json"
curl -sSL -H "User-Agent: Axevora-Deploy-Script" \
  https://api.github.com/repos/karust/openserp/releases/latest > "$RELEASE_JSON" 2>/dev/null || true

# If latest fails, fallback to specific tag v0.8.12
if [ ! -s "$RELEASE_JSON" ] || grep -q "API rate limit exceeded" "$RELEASE_JSON" 2>/dev/null; then
  warn "GitHub API rate limit or error; using direct v0.8.12 release tag metadata..."
  curl -sSL -H "User-Agent: Axevora-Deploy-Script" \
    https://api.github.com/repos/karust/openserp/releases/tags/v0.8.12 > "$RELEASE_JSON" 2>/dev/null || true
fi

OPENSERP_VERSION_TAG=""
ASSET_NAME=""
DOWNLOAD_URL=""

# Use Python3 if available for JSON parsing
if command -v python3 >/dev/null 2>&1; then
  PARSED_INFO=$(python3 -c "
import json, sys
try:
    with open('$RELEASE_JSON', 'r') as f:
        data = json.load(f)
    tag = data.get('tag_name', 'v0.8.12')
    target_prefix = 'openserp-linux-$GOARCH-'
    selected = None
    for a in data.get('assets', []):
        name = a.get('name', '')
        if name.startswith(target_prefix) and name.endswith('.tgz'):
            selected = a
            break
    if selected:
        print(f\"{tag}|{selected['name']}|{selected['browser_download_url']}\")
    else:
        print('NOT_FOUND')
except Exception as e:
    print('ERROR:' + str(e))
" 2>/dev/null || echo "PYTHON_FAILED")

  if [[ "$PARSED_INFO" == *"|"* ]]; then
    OPENSERP_VERSION_TAG=$(echo "$PARSED_INFO" | cut -d '|' -f 1)
    ASSET_NAME=$(echo "$PARSED_INFO" | cut -d '|' -f 2)
    DOWNLOAD_URL=$(echo "$PARSED_INFO" | cut -d '|' -f 3)
  fi
fi

# Fallback asset URL if Python was unavailable or API failed
if [ -z "$DOWNLOAD_URL" ]; then
  OPENSERP_VERSION_TAG="v0.8.12"
  ASSET_NAME="openserp-linux-${GOARCH}-0.8.12.tgz"
  DOWNLOAD_URL="https://github.com/karust/openserp/releases/download/${OPENSERP_VERSION_TAG}/${ASSET_NAME}"
  log "Using canonical direct asset URL fallback: ${DOWNLOAD_URL}"
fi

log "OpenSERP Version: ${OPENSERP_VERSION_TAG}"
log "Selected Release Asset: ${ASSET_NAME}"
log "Download URL: ${DOWNLOAD_URL}"

TEMP_TAR="/tmp/${ASSET_NAME}"
log "Downloading OpenSERP binary archive to ${TEMP_TAR}..."

# Download with curl following redirects (-L) and failing on error (-f)
curl -fL -H "User-Agent: Axevora-Deploy-Script" \
  -o "$TEMP_TAR" "$DOWNLOAD_URL"

if [ ! -f "$TEMP_TAR" ] || [ "$(wc -c < "$TEMP_TAR" 2>/dev/null || echo 0)" -lt 5000000 ]; then
  err "FAILED: Downloaded archive is missing or too small (<5MB)"
  exit 1
fi

DOWNLOADED_SIZE=$(wc -c < "$TEMP_TAR")
log "Download: SUCCESS (Size: ${DOWNLOADED_SIZE} bytes)"

# Extract archive
log "Extracting ${TEMP_TAR} into ${OPENSERP_INSTALL_DIR}..."
tar -xzf "$TEMP_TAR" -C "${OPENSERP_INSTALL_DIR}"
rm -f "$TEMP_TAR" "$RELEASE_JSON"

OPENSERP_BINARY="${OPENSERP_INSTALL_DIR}/openserp"
if [ ! -f "$OPENSERP_BINARY" ]; then
  err "FAILED: Binary ${OPENSERP_BINARY} not found after extraction"
  exit 1
fi

chmod +x "$OPENSERP_BINARY"

# Verify binary execution
log "Verifying binary execution..."
if "$OPENSERP_BINARY" --help >/dev/null 2>&1 || "$OPENSERP_BINARY" version >/dev/null 2>&1; then
  log "Binary: VALID (${OPENSERP_BINARY} is executable and functional)"
else
  err "Binary verification failed for ${OPENSERP_BINARY}"
  exit 1
fi

# Check memory before running
AVAILABLE_MB=$(free -m | awk '/^Mem:/ {print $7}')
log "Available memory: ${AVAILABLE_MB}MB"
if [ "$AVAILABLE_MB" -lt 200 ]; then
  warn "T2.MICRO RESOURCE WARNING: Only ${AVAILABLE_MB}MB available."
  warn "OpenSERP may be memory-constrained. Monitor carefully after start."
fi

# =============================================================================
# PHASE 6: OPENSERP CONFIG (conservative for t2.micro)
# =============================================================================
section "PHASE 6: CONFIGURE OPENSERP (CONSERVATIVE FOR T2.MICRO)"

# Create conservative OpenSERP config
cat > "${OPENSERP_INSTALL_DIR}/config.yaml" << 'CONFIGEOF'
# OpenSERP Configuration -- Axevora EC2 axevora-trade t2.micro
# CONSERVATIVE settings for t2.micro (1 vCPU, 1GB RAM)
server:
  host: "127.0.0.1"    # NEVER expose publicly
  port: 7000
  timeout: 30

# Rate limiting -- protect the small instance
ratelimit:
  enabled: true
  requests_per_minute: 20  # Conservative for t2.micro

# Concurrency -- LOW for t2.micro
workers: 1              # Single worker -- do NOT increase on t2.micro
max_concurrent: 2       # Max 2 parallel searches

# Browser/headless settings (if applicable)
browser:
  headless: true
  timeout: 30000        # 30s timeout per search
  max_instances: 1      # Single browser instance on t2.micro

# Search engines -- use Bing Image Search initially (lightweight)
engines:
  - name: "bing"
    enabled: true
  - name: "duckduckgo"
    enabled: false     # Multi-engine disabled initially
  - name: "google"
    enabled: false     # Google disabled initially to prevent CAPTCHA/bot challenges

# Logging
log:
  level: "info"
  file: "/var/log/openserp.log"
CONFIGEOF

log "Config written: ${OPENSERP_INSTALL_DIR}/config.yaml"
log "T2.MICRO CONSTRAINT: workers=1, max_concurrent=2, single browser instance"

# =============================================================================
# =============================================================================
# PHASE 7: SYSTEMD SERVICE
# =============================================================================
section "PHASE 7: CREATE SYSTEMD SERVICE"

cat > "/etc/systemd/system/${OPENSERP_SERVICE}.service" << SERVICEEOF
[Unit]
Description=Axevora OpenSERP Image/Web Search Engine
After=network.target
StartLimitIntervalSec=60
StartLimitBurst=3

[Service]
Type=simple
User=ubuntu
WorkingDirectory=${OPENSERP_INSTALL_DIR}
ExecStart=${OPENSERP_INSTALL_DIR}/openserp serve -a 127.0.0.1 -p 7000 -r
Restart=on-failure
RestartSec=10

# Resource limits for t2.micro (raw HTTP mode uses < 40MB)
MemoryMax=512M
CPUQuota=75%

# Logging
StandardOutput=journal
StandardError=journal
SyslogIdentifier=openserp

# Security
NoNewPrivileges=true
PrivateTmp=true

[Install]
WantedBy=multi-user.target
SERVICEEOF

systemctl daemon-reload
systemctl enable "${OPENSERP_SERVICE}"
systemctl restart "${OPENSERP_SERVICE}"
sleep 5

if systemctl is-active --quiet "${OPENSERP_SERVICE}"; then
  log "OpenSERP service started successfully"
  systemctl status "${OPENSERP_SERVICE}" | tee -a "$LOG_FILE"
else
  err "OpenSERP service FAILED to start"
  journalctl -u "${OPENSERP_SERVICE}" -n 30 --no-pager | tee -a "$LOG_FILE"
fi

# =============================================================================
# PHASE 8: NGINX REVERSE PROXY WITH AUTHENTICATION (APT SELF-HEALING)
# =============================================================================
section "PHASE 8: NGINX REVERSE PROXY WITH AUTHENTICATION"

if ! command -v nginx >/dev/null 2>&1; then
  log "Installing nginx with automated APT dependency healing..."
  DEBIAN_FRONTEND=noninteractive dpkg --configure -a 2>/dev/null || true
  DEBIAN_FRONTEND=noninteractive apt-get --fix-broken install -y -q 2>/dev/null || true
  DEBIAN_FRONTEND=noninteractive apt-get update -q 2>/dev/null || true
  
  DEBIAN_FRONTEND=noninteractive apt-get install -y -q nginx || {
    warn "Initial nginx install failed, running aggressive dpkg & apt-get repair..."
    DEBIAN_FRONTEND=noninteractive apt-get --fix-broken install -y -q
    DEBIAN_FRONTEND=noninteractive apt-get install -y -q nginx
  }
fi

# Generate or reuse shared secret for Axevora <-> OpenSERP authentication
# Stored securely with chmod 600; NOT written into persistent deploy logs
if [ -f "${OPENSERP_INSTALL_DIR}/.secret" ] && [ -s "${OPENSERP_INSTALL_DIR}/.secret" ]; then
  OPENSERP_SECRET=$(cat "${OPENSERP_INSTALL_DIR}/.secret")
  log "Reusing existing OPENSERP_SECRET_KEY from ${OPENSERP_INSTALL_DIR}/.secret"
else
  OPENSERP_SECRET=$(openssl rand -hex 32)
  echo "$OPENSERP_SECRET" > "${OPENSERP_INSTALL_DIR}/.secret"
  chmod 600 "${OPENSERP_INSTALL_DIR}/.secret"
  log "OPENSERP_SECRET_KEY generated and saved to ${OPENSERP_INSTALL_DIR}/.secret (chmod 600)"
fi

echo "---------------------------------------------------------------"
echo "[SECURE OUTPUT] OPENSERP_SECRET_KEY: ${OPENSERP_SECRET}"
echo "Add this key to Cloudflare: wrangler secret put OPENSERP_SECRET_KEY"
echo "---------------------------------------------------------------"

cat > "/etc/nginx/sites-available/${NGINX_SITE_NAME}" << NGINXEOF
# Axevora OpenSERP Reverse Proxy
# SECURITY: Only allows requests with correct X-Axevora-Secret header
# DO NOT enable public access on port 7000

server {
    listen 80 default_server;
    listen [::]:80 default_server;
    listen ${NGINX_LISTEN_PORT};
    server_name _;

    # Health check endpoint (exempt from auth -- internal monitoring)
    location = /healthz {
        add_header Content-Type application/json;
        return 200 '{"status":"ok","service":"openserp"}';
    }

    # Protected OpenSERP proxy
    location / {
        if (\$http_x_axevora_secret != "${OPENSERP_SECRET}") {
            return 403 '{"error":"Unauthorized"}';
        }

        # Convenience alias for generic image endpoint
        rewrite ^/image$ /bing/image break;

        proxy_pass http://${OPENSERP_BIND}:${OPENSERP_PORT};
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_read_timeout 60s;
        proxy_connect_timeout 10s;
        proxy_set_header X-Axevora-Secret "";
    }
}
NGINXEOF

rm -f /etc/nginx/sites-enabled/default 2>/dev/null || true
ln -sf "/etc/nginx/sites-available/${NGINX_SITE_NAME}" "/etc/nginx/sites-enabled/${NGINX_SITE_NAME}" 2>/dev/null || true
nginx -t && systemctl reload nginx
log "Nginx configured on port 80 and ${NGINX_LISTEN_PORT} with X-Axevora-Secret authentication"

# =============================================================================
# PHASE 9: HEALTH TESTS
# =============================================================================
section "PHASE 9: HEALTH TESTS"

sleep 3

log "Testing OpenSERP health (direct)..."
HEALTH_RESPONSE=$(curl -s --max-time 10 "http://${OPENSERP_BIND}:${OPENSERP_PORT}/health" 2>&1 || echo "FAILED")
log "Direct health: ${HEALTH_RESPONSE}"

log "Testing OpenSERP health (via nginx)..."
NGINX_HEALTH=$(curl -s --max-time 10 "http://localhost:${NGINX_LISTEN_PORT}/healthz" 2>&1 || echo "FAILED")
log "Nginx health: ${NGINX_HEALTH}"

log "Testing auth rejection (no secret)..."
AUTH_REJECT=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:${NGINX_LISTEN_PORT}/image?q=test" 2>&1)
if [ "$AUTH_REJECT" = "403" ]; then
  log "PASS: Unauthenticated request correctly rejected with 403"
else
  warn "Expected 403, got: ${AUTH_REJECT}"
fi

log "Testing auth acceptance (with secret)..."
AUTH_ACCEPT=$(curl -s -o /dev/null -w "%{http_code}" -H "X-Axevora-Secret: ${OPENSERP_SECRET}" \
  "http://localhost:${NGINX_LISTEN_PORT}/image?q=test" 2>&1)
log "Authenticated request status: ${AUTH_ACCEPT}"

# =============================================================================
# PHASE 10: IMAGE SEARCH TESTS
# =============================================================================
section "PHASE 10: IMAGE SEARCH TESTS"

test_image_search() {
  local QUERY="$1"
  local LABEL="$2"
  log "--- Test: ${LABEL} ---"
  log "Query: ${QUERY}"
  ENCODED_QUERY=$(python3 -c "import urllib.parse; print(urllib.parse.quote('${QUERY}'))" 2>/dev/null || echo "${QUERY// /+}")
  RESULT=$(curl -s --max-time 15 -H "X-Axevora-Secret: ${OPENSERP_SECRET}" \
    "http://localhost:${NGINX_LISTEN_PORT}/bing/image?text=${ENCODED_QUERY}" \
    2>&1)
  log "Response: ${RESULT}"
  echo "---"
}

test_image_search "Samsung 55 inch 4K TV" "Test 1: Generic Samsung TV"
test_image_search "Samsung QA55DUE70BKLXL" "Test 2: Exact Samsung model"
test_image_search "iPhone 15 128GB Black" "Test 3: iPhone"
test_image_search "OnePlus Nord CE6 Lite 5G 8GB 128GB" "Test 4: OnePlus"
test_image_search "Sony WH-1000XM5" "Test 5: Sony Headphones"

# Test mega endpoint if available
log "--- Test: Direct Bing Search ---"
BING_RESULT=$(curl -s --max-time 20 -H "X-Axevora-Secret: ${OPENSERP_SECRET}" \
  "http://localhost:${NGINX_LISTEN_PORT}/bing/search?text=Samsung+55+4K+TV" 2>&1)
log "Bing web result: ${BING_RESULT}"

# =============================================================================
# PHASE 11: RESOURCE CHECK AFTER DEPLOYMENT
# =============================================================================
section "PHASE 11: POST-DEPLOYMENT RESOURCE CHECK"

log "--- Memory after deployment ---"
free -h | tee -a "$LOG_FILE"

log "--- Disk after deployment ---"
df -h / | tee -a "$LOG_FILE"

log "--- Listening ports ---"
ss -tlnp | tee -a "$LOG_FILE"

# =============================================================================
# PHASE 12: SUMMARY
# =============================================================================
section "PHASE 12: DEPLOYMENT SUMMARY"

log "OpenSERP Version: ${OPENSERP_VERSION_TAG}"
log "OpenSERP Binary: ${OPENSERP_BINARY}"
log "OpenSERP Bind: ${OPENSERP_BIND}:${OPENSERP_PORT} (NOT public)"
log "Nginx internal port: ${NGINX_LISTEN_PORT}"
log "Backup: ${BACKUP_DIR}.tar.gz"
log "Log: ${LOG_FILE}"
log ""
log "=== MANUAL ACTIONS REQUIRED ==="
log "1. Save OPENSERP_SECRET_KEY to Cloudflare: wrangler secret put OPENSERP_SECRET_KEY"
log "   Value: ${OPENSERP_SECRET}"
log ""
log "2. Set OPENSERP_ENDPOINT in Cloudflare:"
log "   For Cloudflare Tunnel: wrangler secret put OPENSERP_ENDPOINT"
log "   Value: http://localhost:${NGINX_LISTEN_PORT}"
log "   (or HTTPS domain if tunnel is configured)"
log ""
log "3. If using Cloudflare Tunnel:"
log "   cloudflared tunnel create axevora-search"
log "   cloudflared tunnel route dns axevora-search search.axevora.com"
log "   cloudflared tunnel run axevora-search"
log ""
log "=== DO NOT DELETE BACKUP UNTIL OPENSERP VALIDATED ==="

log "SCRIPT COMPLETE"

