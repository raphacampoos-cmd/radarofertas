FROM node:22-alpine

# Instalar pnpm via corepack
RUN corepack enable && corepack prepare pnpm@11.23.0 --activate

WORKDIR /app

# Copiar ficheiros de configuração do monorepo
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./

# Copiar package.json de cada workspace
COPY packages/db/package.json ./packages/db/
COPY packages/deal-engine/package.json ./packages/deal-engine/
COPY apps/api/package.json ./apps/api/

# Instalar dependências (NODE_ENV não definido aqui para incluir devDeps necessárias)
RUN pnpm install --no-frozen-lockfile --ignore-scripts

# Copiar código fonte
COPY packages/ ./packages/
COPY apps/api/ ./apps/api/

# Definir NODE_ENV depois do install
ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

CMD ["node", "node_modules/.bin/tsx", "apps/api/src/index.ts"]
