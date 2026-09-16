#!/usr/bin/env bash
set -euo pipefail

umask 077

readonly PROJECT_DIR="${KUDA_KRYM_PROJECT_DIR:-/opt/kuda-krym}"
readonly BACKUP_DIR="${KUDA_KRYM_BACKUP_DIR:-${PROJECT_DIR}/backups}"
readonly RETENTION_DAYS="${KUDA_KRYM_BACKUP_RETENTION_DAYS:-14}"
readonly TIMESTAMP="$(date +%F-%H%M%S)"
readonly FINAL_FILE="${BACKUP_DIR}/kuda-krym-${TIMESTAMP}.sql.gz"
readonly TEMP_FILE="${FINAL_FILE}.tmp"

if [[ ! "${RETENTION_DAYS}" =~ ^[0-9]+$ ]]; then
  echo "KUDA_KRYM_BACKUP_RETENTION_DAYS must be a non-negative integer" >&2
  exit 1
fi

mkdir -p "${BACKUP_DIR}"
cd "${PROJECT_DIR}"

cleanup() {
  rm -f "${TEMP_FILE}"
}
trap cleanup EXIT

docker compose exec -T postgres sh -c \
  'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB"' \
  | gzip > "${TEMP_FILE}"

gzip -t "${TEMP_FILE}"
mv "${TEMP_FILE}" "${FINAL_FILE}"
find "${BACKUP_DIR}" -type f -name 'kuda-krym-*.sql.gz' -mtime "+${RETENTION_DAYS}" -delete

trap - EXIT
echo "PostgreSQL backup created: ${FINAL_FILE}"
