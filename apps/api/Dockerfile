# syntax=docker/dockerfile:1

FROM node:20.19.1-bookworm-slim AS dependencies

WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/contracts/package.json packages/contracts/package.json
COPY packages/database/package.json packages/database/package.json

RUN npm ci

FROM dependencies AS builder

COPY . .

RUN npm run build --workspace @kuda-krym/contracts \
    && npm run build --workspace @kuda-krym/database \
    && npm run build --workspace @kuda-krym/api

FROM node:20.19.1-bookworm-slim AS migration-dependencies

WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/contracts/package.json packages/contracts/package.json
COPY packages/database/package.json packages/database/package.json

# Install only database tooling and its workspace dependencies, not Next.js or API tooling.
RUN npm ci --workspace @kuda-krym/database --include-workspace-root=false \
    && npm cache clean --force

FROM migration-dependencies AS migrator

ENV NODE_ENV=production
WORKDIR /app

COPY --from=builder --chown=node:node /app/packages/database/prisma ./packages/database/prisma
COPY --from=builder --chown=node:node /app/packages/database/prisma.config.ts ./packages/database/prisma.config.ts
COPY --from=builder --chown=node:node /app/packages/database/src ./packages/database/src
COPY --from=builder --chown=node:node /app/packages/database/dist ./packages/database/dist
COPY --from=builder --chown=node:node /app/packages/contracts/dist ./packages/contracts/dist

USER node

CMD ["npm", "run", "deploy", "--workspace", "@kuda-krym/database"]

FROM node:20.19.1-bookworm-slim AS production-dependencies

ENV NODE_ENV=production
WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/contracts/package.json packages/contracts/package.json
COPY packages/database/package.json packages/database/package.json

RUN npm ci --omit=dev --workspace @kuda-krym/api --include-workspace-root \
    && npm cache clean --force

FROM node:20.19.1-bookworm-slim AS runner

ENV NODE_ENV=production
ENV PORT=4000
WORKDIR /app

COPY --from=production-dependencies --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node package.json ./package.json
COPY --from=builder --chown=node:node /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder --chown=node:node /app/apps/api/dist ./apps/api/dist
COPY --from=builder --chown=node:node /app/packages/contracts/package.json ./packages/contracts/package.json
COPY --from=builder --chown=node:node /app/packages/contracts/dist ./packages/contracts/dist
COPY --from=builder --chown=node:node /app/packages/database/package.json ./packages/database/package.json
COPY --from=builder --chown=node:node /app/packages/database/dist ./packages/database/dist

USER node

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD ["node", "-e", "fetch('http://127.0.0.1:4000/api/health/live').then((response) => { if (!response.ok) process.exit(1); }).catch(() => process.exit(1));"]

CMD ["node", "apps/api/dist/server.js"]
