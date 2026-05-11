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
npx prisma db push

# run this to add media to the database, need for first time after schema shift
# echo "🧩 Running custom media migration"
# npm run migration:media

echo "🌱 Running prisma db seed"
npx prisma db seed

if [ $? -eq 0 ]; then
  echo "Prisma db seed successful!"
else
  echo "Prisma db seed failed!"
  exit 1
fi

echo "Starting application..."
exec npm run start:prod