#!/usr/bin/env bash
set -euo pipefail

APP_BASE_DIR="${APP_BASE_DIR:-/var/www/nocode}"
CRON_EXPR="30 3 * * *"
LINE="${CRON_EXPR} APP_BASE_DIR=${APP_BASE_DIR} ${APP_BASE_DIR}/scripts/backup.sh >> ${APP_BASE_DIR}/backups/backup.log 2>&1"

TMP_FILE="$(mktemp)"
crontab -l 2>/dev/null | grep -v "${APP_BASE_DIR}/scripts/backup.sh" > "${TMP_FILE}" || true
echo "${LINE}" >> "${TMP_FILE}"
crontab "${TMP_FILE}"
rm -f "${TMP_FILE}"

echo "[cron] installed: ${LINE}"
