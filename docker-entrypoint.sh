#!/bin/sh
set -e

# Run Prisma migrations if using direct PostgreSQL (not Prisma Accelerate)
if [ -n "$DATABASE_URL" ]; then
  case "$DATABASE_URL" in
    prisma+postgres://*)
      echo "Prisma Accelerate detected — skipping migrations"
      ;;
    *)
      echo "Running database migrations..."
      yarn prisma migrate deploy --schema=lib/schema.prisma
      echo "Migrations complete"
      ;;
  esac
fi

exec "$@"
