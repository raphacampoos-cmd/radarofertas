# 📡 RadarOfertas

**Plataforma portuguesa de agregação de ofertas com histórico de preços real e Deal Score algorítmico.**

> Gaming 🕹️ · Casa/Electrodomésticos 🏡 · Suplementação 💪

---

## Stack Tecnológica

| Componente | Tecnologia |
|---|---|
| Frontend | Next.js 15 + React 19 |
| API | Node.js + Hono |
| Database | PostgreSQL 16 + Drizzle ORM |
| Cache | Redis 7 |
| Gráficos | Recharts |
| Monorepo | pnpm workspaces + Turborepo |

---

## Arranque Rápido (Desenvolvimento)

### Pré-requisitos
- Node.js >= 20
- pnpm >= 9
- Docker Desktop

### 1. Clonar e instalar dependências

```bash
git clone [repo]
cd radarofertas
pnpm install
```

### 2. Iniciar a base de dados

```bash
docker compose up -d
```

### 3. Configurar variáveis de ambiente

Os ficheiros `.env` já estão configurados para desenvolvimento local:
- `packages/db/.env` — URL da base de dados
- `apps/api/.env` — API config
- `apps/web/.env.local` — Frontend config

### 4. Criar as tabelas (migrations)

```bash
cd packages/db
pnpm db:push
```

### 5. Popular com dados iniciais

```bash
pnpm db:seed
```

### 6. Iniciar todos os serviços

```bash
# Na raiz do projeto
pnpm dev
```

- **Frontend:** http://localhost:3000
- **API:** http://localhost:3001
- **API Health:** http://localhost:3001/health

---

## Estrutura do Projeto

```
radarofertas/
├── apps/
│   ├── web/          ← Next.js 15 (frontend + SSR/SSG)
│   └── api/          ← Node.js + Hono (REST API)
├── packages/
│   ├── db/           ← Schema PostgreSQL + Drizzle ORM
│   ├── shared/       ← Types TypeScript partilhados
│   └── deal-engine/  ← Deal Score + lógica de negócio
├── docker-compose.yml
└── turbo.json
```

---

## Funcionalidades do MVP 1

- ✅ Feed de ofertas paginado
- ✅ Páginas de categoria (Gaming, Casa, Suplementação)
- ✅ **Páginas de produto INDEXADAS** (diferencial SEO vs concorrência)
- ✅ **Gráfico de histórico de preços** (90 dias)
- ✅ **Deal Score algorítmico** (0-100, 6 factores)
- ✅ Links de afiliados com tracking de cliques
- ✅ Caixa de cupão com copy automático
- ✅ Badge "Mínimo Histórico"
- ✅ Schema.org Product + Offer + BreadcrumbList
- ✅ Sitemap dinâmico + robots.txt
- ✅ Pesquisa básica

---

## Admin API

Criar uma oferta via API:

```bash
curl -X POST http://localhost:3001/api/admin/offers \
  -H "Content-Type: application/json" \
  -H "X-Admin-Key: radar_admin_secret_change_in_production" \
  -d '{
    "title": "PlayStation 5 Slim Digital Edition",
    "storeId": 1,
    "priceCurrent": 349.99,
    "priceOriginal": 449.99,
    "affiliateUrl": "https://www.amazon.es/dp/B0CL5KNB9M?tag=radarofertas-21",
    "categoryIds": [1, 3],
    "imageUrl": "https://...",
    "description": "Consola PS5 Slim..."
  }'
```

---

## Deal Score — Como é Calculado

O Deal Score (0-100) é calculado com base em 6 fatores:

| Factor | Peso | Descrição |
|---|---|---|
| Desconto real | 30% | % de desconto vs preço original |
| Histórico | 25% | Distância do mínimo histórico |
| Média 90 dias | 15% | Comparação com média recente |
| Qualidade da loja | 15% | Fiabilidade histórica |
| Urgência | 10% | Proximidade da expiração |
| Comissão | 5% | Potencial de receita |

Labels: 🔥 Histórico (85+) · ⚡ Excelente (65+) · 👍 Bom (45+) · 💬 Regular (25+) · ❄️ Fraco

---

## Deploy (Produção)

| Serviço | Provider | Custo Estimado |
|---|---|---|
| Frontend | Vercel | Grátis |
| API | Railway | ~$5/mês |
| PostgreSQL | Railway | ~$5/mês |
| Redis | Railway | ~$3/mês |
| CDN/DNS | Cloudflare | Grátis |
| Total | | ~$13-15/mês |

---

*RadarOfertas — Esta oferta realmente vale a pena?*
