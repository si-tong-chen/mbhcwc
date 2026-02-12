#!/usr/bin/env bash
set -euo pipefail

APP_BASE_DIR="${APP_BASE_DIR:-/var/www/nocode}"
APP_DATA_DIR="${APP_DATA_DIR:-${APP_BASE_DIR}/data}"
APP_UPLOADS_DIR="${APP_UPLOADS_DIR:-${APP_BASE_DIR}/uploads}"
APP_BACKUPS_DIR="${APP_BACKUPS_DIR:-${APP_BASE_DIR}/backups}"
DB_FILE="${APP_DATA_DIR}/content.db"

mkdir -p "${APP_BACKUPS_DIR}"

if [ ! -f "${DB_FILE}" ]; then
  echo "[backup] sqlite db not found: ${DB_FILE}" >&2
  exit 1
fi

if [ ! -d "${APP_UPLOADS_DIR}" ]; then
  echo "[backup] uploads dir not found: ${APP_UPLOADS_DIR}" >&2
  exit 1
fi

TS="$(date +%Y%m%d-%H%M%S)"
OUT_FILE="${APP_BACKUPS_DIR}/backup-${TS}.tar.gz"

# Pack sqlite + uploads folder.
tar -czf "${OUT_FILE}" -C "${APP_DATA_DIR}" "content.db" -C "${APP_BASE_DIR}" "uploads"

# Keep latest 2 backups only.
INDEX=0
ls -1t "${APP_BACKUPS_DIR}"/backup-*.tar.gz 2>/dev/null | while IFS= read -r FILE; do
  INDEX=$((INDEX + 1))
  if [ "${INDEX}" -gt 2 ]; then
    rm -f "${FILE}"
  fi
done

echo "[backup] created: ${OUT_FILE}"
