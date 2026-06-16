#!/usr/bin/env bash
# Production deployment script for cosmic-mind
#
# Usage:
#   ./deploy.sh   # pull + rebuild + restart (idempotent, safe to re-run)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COMPOSE="docker compose -f $SCRIPT_DIR/docker-compose.yml"

echo "================================================"
echo "  Cosmic Mind — Production Deployment"
echo "================================================"

# ── 1. Pull latest code ──────────────────────────────────────────────────────
echo ""
echo "→ [1/3] Pulling latest code from origin..."
git -C "$SCRIPT_DIR" pull --ff-only

# ── 2. Build image ───────────────────────────────────────────────────────────
echo ""
echo "→ [2/3] Building image..."
$COMPOSE build cosmic_mind

# ── 3. Start/restart container ───────────────────────────────────────────────
echo ""
echo "→ [3/3] Restarting container..."
$COMPOSE up -d --no-deps cosmic_mind

# ── Housekeeping ─────────────────────────────────────────────────────────────
echo ""
echo "  Cleaning up dangling images and build cache..."
docker image prune -f
docker builder prune -f

# ── Done ─────────────────────────────────────────────────────────────────────
echo ""
echo "================================================"
echo "  Deploy complete!"
echo "================================================"
