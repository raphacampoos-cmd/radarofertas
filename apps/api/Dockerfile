FROM node:22-alpine AS base
RUN npm i -g pnpm@11.23.0

# Instalar dependências
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/db/package.json ./packages/db/
COPY packages/deal-engine/package.json ./packages/deal-engine/
COPY apps/api/package.json ./apps/api/
RUN pnpm install --frozen-lockfile --ignore-scripts

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/db/node_modules ./packages/db/node_modules
COPY --from=deps /app/packages/deal-engine/node_modules ./packages/deal-engine/node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY . .
RUN pnpm --filter @radarofertas/api build

# Produção
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/db/src ./packages/db/src
COPY --from=builder /app/apps/api/package.json ./

EXPOSE 3001

CMD ["node", "dist/index.js"]
