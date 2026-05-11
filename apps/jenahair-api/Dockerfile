# Stage 1: Dependencies + Build (full workspace)
FROM node:22-alpine AS builder
WORKDIR /repo

# Copy workspace manifests first for cache efficiency
COPY package.json package-lock.json ./
COPY apps/jenahair-api/package.json ./apps/jenahair-api/
# When new apps/packages join the workspace, copy their package.json here too.

RUN npm ci

# Copy the rest of the workspace source
COPY . .

# Build-time ENV
ARG DATABASE_URL
ARG VERSION
ENV DATABASE_URL=$DATABASE_URL
ENV VERSION=$VERSION

# Prisma generate + Nest build scoped to this app
WORKDIR /repo/apps/jenahair-api
RUN npx prisma generate
RUN npm run build

# Stage 2: Production dependencies only
FROM node:22-alpine AS deps
WORKDIR /repo
COPY package.json package-lock.json ./
COPY apps/jenahair-api/package.json ./apps/jenahair-api/
RUN npm ci --omit=dev

# Stage 3: Runtime (flatten app into /app)
FROM node:22-alpine AS production
WORKDIR /app
RUN apk add --no-cache netcat-openbsd

COPY --from=builder /repo/apps/jenahair-api/package.json ./package.json
COPY --from=deps    /repo/node_modules                  ./node_modules
COPY --from=deps    /repo/apps/jenahair-api/node_modules ./apps/jenahair-api/node_modules
COPY --from=builder /repo/apps/jenahair-api/dist                       ./dist
COPY --from=builder /repo/apps/jenahair-api/src/prisma/schema.prisma   ./src/prisma/schema.prisma
COPY --from=builder /repo/apps/jenahair-api/src/prisma/migrations      ./src/prisma/migrations
COPY apps/jenahair-api/prisma.config.ts ./prisma.config.ts
COPY apps/jenahair-api/start.sh ./
RUN chmod +x start.sh

EXPOSE 8000
CMD ["sh", "./start.sh"]
