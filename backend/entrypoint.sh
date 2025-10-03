#!/bin/sh
set -e

echo "Running Prisma migrate deploy..."
npx prisma migrate deploy

echo "Seeding database (idempotent)..."
node prisma/seed.cjs || true

echo "Starting PM2 in cluster mode..."
exec pm2-runtime start ecosystem.config.js
