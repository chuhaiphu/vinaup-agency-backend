#!/bin/sh
set -e

echo "⏳ Waiting for database..."
until nc -z db 5432; do
  echo "❌ Database not ready, sleeping..."
  sleep 2
done

echo "✅ Database is ready"

echo "⚠️ Running prisma migrate deploy"
# run this to reset the database for first schema shift in the production
# npx prisma migrate reset --force
npx prisma migrate deploy

echo "🌱 Running prisma db seed"
npx prisma db seed
echo "Prisma db seed successful!"

echo "Starting application..."
exec npm run start:prod