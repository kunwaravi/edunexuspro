#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════
#  EduNexus Pro — Production Deploy Script
#  Deploys latest backend + frontend to Hostinger VPS.
#
#  Target : 187.127.156.138 → /docker/edunexuspro
#  Stack  : docker-compose.prod.yml (loopback + external DB volume = data-safe)
#  Live   : https://edunexus.kibm.in
#
#  Usage  : bash scripts/deploy.sh          (run from repo root)
#  Pre-req: ~/.ssh/hostinger_edunexus.pem exists (SSH key to VPS)
#
#  SAFETY — yeh script kabhi nahi karega:
#    • .env overwrite (VPS ka secrets file untouched)
#    • DB volume wipe / prisma migrate --accept-data-loss
#    • co-tenant services (nexustrade, mudra) ko touch
#  Yeh hamesha karega:
#    • DB backup pehle (pg_dump → /root/edunexuspro-backups/)
#    • migration .sql files ke saath sync (NEVER exclude *.sql)
# ═══════════════════════════════════════════════════════════════════════

set -e

KEY="$HOME/.ssh/hostinger_edunexus.pem"
HOST="root@187.127.156.138"
COMPOSE="docker-compose.prod.yml"
REMOTE_DIR="/docker/edunexuspro"
SSH_OPTS="-i $KEY -o StrictHostKeyChecking=no"

# ── Pre-flight ────────────────────────────────────────────────────────
[ -f "$KEY" ] || { echo "✗ SSH key missing: $KEY"; exit 1; }
cd "$(dirname "$0")/.."   # repo root
[ -f "docker-compose.prod.yml" ] || { echo "✗ run from repo root"; exit 1; }

echo "═══ [0/5] Pre-flight ═══"
ssh $SSH_OPTS "$HOST" 'echo "  ✓ SSH to VPS OK"' || { echo "✗ cannot reach VPS"; exit 1; }

echo "═══ [1/5] Backing up production DB ═══"
ssh $SSH_OPTS "$HOST" "mkdir -p /root/edunexuspro-backups && docker exec edunexuspro-db-1 pg_dump -U nexusadmin -d nexus --no-owner > /root/edunexuspro-backups/nexus_\$(date +%Y%m%d_%H%M%S).sql" \
  && echo "  ✓ DB backup → /root/edunexuspro-backups/"

echo "═══ [2/5] Syncing code ═══"
# ⚠️ KAHAAN SE BHI MAT HATAO: kabhi bhi *.sql exclude mat karo —
#    prisma/migrations/*.sql DB migrate ke liye zaroori hain (P3015 bug se seekha).
rsync -az --delete -e "ssh $SSH_OPTS" \
  --exclude node_modules --exclude dist --exclude .env --exclude '*.tsbuildinfo' \
  ./backend/ "$HOST:$REMOTE_DIR/backend/"
rsync -az --delete -e "ssh $SSH_OPTS" \
  --exclude node_modules --exclude dist --exclude .env --exclude '*.tsbuildinfo' \
  ./frontend/ "$HOST:$REMOTE_DIR/frontend/"
echo "  ✓ backend + frontend synced"

echo "═══ [3/5] Building images ═══"
ssh $SSH_OPTS "$HOST" "cd $REMOTE_DIR && docker compose -f $COMPOSE build" 2>&1 | tail -2

echo "═══ [4/5] Starting stack (DB volume untouched) ═══"
ssh $SSH_OPTS "$HOST" "cd $REMOTE_DIR && docker compose -f $COMPOSE up -d" 2>&1 | tail -4

echo "═══ [5/5] Health check ═══"
sleep 12
ssh $SSH_OPTS "$HOST" "cd $REMOTE_DIR && docker compose -f $COMPOSE ps 2>/dev/null | grep -v warning && echo '---' && curl -s -m 8 http://127.0.0.1:5000/"

echo ""
echo "✅ Deploy complete. Live: https://edunexus.kibm.in"
echo "   (frontend/backend logs: ssh $HOST 'cd $REMOTE_DIR && docker compose -f $COMPOSE logs -f backend')"
