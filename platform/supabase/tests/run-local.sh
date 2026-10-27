#!/usr/bin/env bash
# Ejecuta migraciones + pruebas de RLS en un Postgres temporal.
# Uso: platform/supabase/tests/run-local.sh   (requiere Postgres 14+ instalado; no usa tu base real)
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
PGBIN="${PGBIN:-$(ls -d /usr/lib/postgresql/*/bin 2>/dev/null | sort -V | tail -1)}"
DATA="$(mktemp -d)"
PORT="${PGPORT:-54329}"

cleanup() { "$PGBIN/pg_ctl" -D "$DATA" stop -m fast >/dev/null 2>&1 || true; rm -rf "$DATA"; }
trap cleanup EXIT

"$PGBIN/initdb" -D "$DATA" -A trust >/dev/null
"$PGBIN/pg_ctl" -D "$DATA" -o "-p $PORT -k $DATA" -w start >/dev/null

PSQL=(psql -h "$DATA" -p "$PORT" -d postgres -v ON_ERROR_STOP=1 -q)
"${PSQL[@]}" -f "$HERE/00_stub_auth.sql"
for f in "$HERE"/../migrations/*.sql; do "${PSQL[@]}" -f "$f"; done
"${PSQL[@]}" -f "$HERE/rls_test.sql"
