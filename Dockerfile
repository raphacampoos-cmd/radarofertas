FROM node:22-alpine

# Instalar pnpm e tsx globalmente
RUN corepack enable && corepack prepare pnpm@11.23.0 --activate
RUN npm install -g tsx

WORKDIR /app

# Copiar ficheiros de configuração do monorepo
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./

# Copiar package.json de cada workspace
COPY packages/db/package.json ./packages/db/
COPY packages/deal-engine/package.json ./packages/deal-engine/
COPY apps/api/package.json ./apps/api/

# Instalar dependências
RUN pnpm install --no-frozen-lockfile --ignore-scripts

# Copiar código fonte
COPY packages/ ./packages/
COPY apps/api/ ./apps/api/

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

CMD ["tsx", "apps/api/src/index.ts"]
