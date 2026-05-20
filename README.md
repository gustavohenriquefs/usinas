# ONS Analytics Dashboard

> Plataforma analítica para visualização de dados energéticos do Sistema Interligado Nacional (SIN), utilizando dados públicos do Operador Nacional do Sistema Elétrico (ONS) via Base dos Dados.

---

## Sumário

- [Visão Geral](#visão-geral)
- [Stack Tecnológica](#stack-tecnológica)
- [Arquitetura](#arquitetura)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Configuração do Ambiente](#configuração-do-ambiente)
- [Docker](#docker)
- [Banco de Dados](#banco-de-dados)
- [API — Backend](#api--backend)
- [Frontend](#frontend)
- [Cobertura Temporal de Dados](#cobertura-temporal-de-dados)
- [Painel Administrativo](#painel-administrativo)
- [Internacionalização](#internacionalização)
- [Utilitários](#utilitários)
- [Decisões de Projeto](#decisões-de-projeto)

---

## Visão Geral

O App é um dashboard analítico full-stack desenvolvido para explorar dados históricos de energia elétrica do SIN. Expõe KPIs e gráficos interativos de:

- **CMO** (Custo Marginal de Operação) por subsistema e patamar de carga
- **Balanço energético** por fonte (hidráulica, térmica, eólica, fotovoltaica)
- **Perfil intradiário** de demanda por subsistema
- **CVU** (Custo Variável Unitário) das usinas termelétricas
- **Intercâmbio** de energia entre subsistemas

Um painel administrativo permite gerenciar quais gráficos são exibidos e personalizar configurações visuais por KPI.

---

## Stack Tecnológica

### Backend
| Tecnologia | Justificativa |
|---|---|
| **Python 3.12 + FastAPI** | Tem várias ferramentas para a manipulação de dados; geração automática de OpenAPI/Swagger |
| **PostgreSQL 16** | Banco relacional robusto para dados temporais; suporta `BigInteger` para volumes de energia em Wh |
| **SQLAlchemy 2 + SQLModel** | Deixa a sintaxe mais simples e evita repetição de código |
| **Uvicorn** | Rápido e simples |
| **structlog** | Logging estruturado em JSON para observabilidade |

### Frontend
| Tecnologia | Justificativa |
|---|---|
| **React 19 + Vite** | Fácil customização e Build rápida|
| **TanStack Query v5** | Facilita o trabalho com cache e muito usado no mercado |
| **ECharts (echarts-for-react)** | Visualização madura com `markLine`, paleta automática multi-série e animações |
| **Recharts** | Usado no `CmoPatamares` por `ReferenceLine` declarativa JSX-friendly |
| **Zustand** | State management leve para filtros globais sem boilerplate |
| **i18next + react-i18next** | Internacionalização pt-BR / en-US; zero strings hardcoded |
| **Sonner** | Toast library standalone (sem Tailwind) para feedback de ações admin |
| **@radix-ui/react-switch** | Toggle acessível (ARIA, focus-visible, keyboard) para o painel admin |

### Infraestrutura
| Tecnologia | Justificativa |
|---|---|
| **Docker + Docker Compose** | Orquestração dos 3 serviços (db, backend, frontend) com rede interna |
| **Nginx** | Serve os estáticos do frontend em produção; `try_files` para SPA routing |
| **envsubst** | Substitui `${SERVER_NAME}` no `nginx.conf` em runtime via variável de ambiente |

### Fluxo de visibilidade de gráficos

1. Admin configura `visivel` e `config_json` por KPI via painel
2. `Dashboard.tsx` chama `GET /api/admin/kpi-config/active` → slugs visíveis ordenados por `ordem`
3. `CHART_FACTORIES` mapeia cada slug ao componente React correspondente
4. Cada chart chama `useChartConfig(slug)` → aplica `unidade`, `decimais`, `meta` e `cor`

### Fluxo de cobertura temporal

1. `GET /api/meta/cobertura` retorna `MIN/MAX` de data de cada tabela fato
2. `CoverageWarning` (na filter bar) compara o período selecionado com a cobertura e exibe aviso
3. Cada endpoint KPI retorna `coverage: DataCoverage` com `cobertura_completa: bool`
4. `CoverageNote` (em cada gráfico) exibe o período efetivo quando `cobertura_completa=false`

---

## Estrutura de Pastas

```
Igeos/
├── backend/
│   ├── app/
│   │   └── main/
│   │       ├── core/
│   │       │   ├── config.py       # Settings via pydantic-settings
│   │       │   ├── coverage.py     # build_coverage() — helper de cobertura temporal
│   │       │   ├── logging.py      # structlog setup
│   │       │   └── messages.py     # Mensagens de erro centralizadas
│   │       ├── database/
│   │       │   ├── seed.py         # Carga idempotente dos CSVs ONS
│   │       │   └── session.py      # Engine + get_session()
│   │       ├── models/             # SQLModel table=True
│   │       ├── routes/             # FastAPI routers
│   │       ├── schemas/
│   │       │   ├── pagination.py   # PaginatedResponse[T] + DataCoverage
│   │       │   └── ...
│   │       └── services/
│   ├── alembic/                    # Migrations versionadas
│   └── requirements.txt
│
├── frontend/
│   └── src/
│       ├── api/
│       │   ├── kpis.ts             # Hooks → KpiResponse<T> com coverage
│       │   ├── admin.ts
│       │   └── meta.ts             # useCobertura(), useSubsistemas()
│       ├── components/
│       │   ├── admin/
│       │   ├── charts/
│       │   │   ├── CoverageNote.tsx  # Anotação inline de cobertura por gráfico
│       │   │   └── ...
│       │   ├── filters/
│       │   │   ├── GlobalFilterBar.tsx
│       │   │   └── CoverageWarning.tsx  # Aviso global de cobertura
│       │   ├── kpi-cards/
│       │   └── layout/
│       ├── hooks/
│       │   └── useChartConfig.ts
│       ├── i18n/locales/           # pt-BR.json, en-US.json
│       ├── pages/
│       ├── store/
│       │   └── filtersStore.ts     # Zustand: draft/commit pattern
│       ├── types/                  # Interfaces globais + KpiResponse, DataCoverage
│       └── utils/
│           └── formatDate.ts       # Formatação de data por locale (Intl.DateTimeFormat)
│
├── data_seed/                      # CSVs ONS (não commitados)
├── docker-compose.yml
├── .env                            # Credenciais (não commitado)
├── .env.example
├── CONSULTAS_PERMITIDAS.md         # Documentação das queries e modelagem do banco
└── DADOS_TEMPORAIS.md              # Conceitos de dados temporais e query contracts
```

---

## Configuração do Ambiente

### Pré-requisitos
- Python 3.12+
- Node.js 22+
- PostgreSQL 16+

### Backend

```bash
cp .env.example .env
# Preencher POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB, POSTGRES_HOST, POSTGRES_PORT

cd backend
python -m venv .venv
.venv\Scripts\activate          # Windows
# source .venv/bin/activate     # Linux/macOS
pip install -r requirements.txt

alembic upgrade head
python -m app.main.database.seed

uvicorn app.server:app --host 0.0.0.0 --port 8000
```

### Frontend

```bash
cd frontend
npm install

# Criar .env.local
echo "VITE_API_URL=http://localhost:8000" > .env.local
echo "VITE_USE_MOCKS=false" >> .env.local

npm run dev   # http://localhost:5173
```

### Variáveis de ambiente

**.env (raiz — lido pelo backend)**
```env
POSTGRES_USER=igeos_admin
POSTGRES_PASSWORD=senha_super_segura_123
POSTGRES_DB=ons_analytics
POSTGRES_HOST=db          # "db" em Docker, "localhost" em dev local
POSTGRES_PORT=5432
SERVER_NAME=localhost     # Usado pelo nginx.conf via envsubst
```

**frontend/.env.local**
```env
VITE_API_URL=http://localhost:8000
VITE_USE_MOCKS=false      # true para usar dados mock sem backend
```

---

## Docker

O projeto usa Docker Compose com 3 serviços em rede interna `igeos_network`:

```bash
# Build e subir todos os serviços
docker compose up --build

# Apenas subir (sem rebuild)
docker compose up

# Parar
docker compose down
```

### Serviços

| Serviço | Imagem | Porta | Descrição |
|---|---|---|---|
| `db` | `postgres:16-alpine` | `5432` | PostgreSQL com healthcheck via `pg_isready` |
| `backend` | `igeos_api` (build local) | `8000` | FastAPI + Uvicorn |
| `frontend` | `igeos_frontend` (build local) | `80` | React buildado + Nginx |

### Frontend Dockerfile (multi-stage)

```
Stage 1 (builder): node:22-alpine → npm install → npm run build → /app/dist
Stage 2 (serve):   nginx:alpine   → copia /dist → envsubst no nginx.conf → nginx
```

O `SERVER_NAME` é injetado via variável de ambiente em runtime — a mesma imagem funciona em qualquer ambiente:

```yaml
environment:
  - SERVER_NAME=${SERVER_NAME:-localhost}
```

---

## Banco de Dados

### Modelagem (Star Schema)

```
dim_subsistema ──┬── fato_balanco_energia_horario
                 ├── fato_balanco_energia_dessem
                 ├── fato_cmo_semanal
                 └── fato_cmo_semi_horario

dim_usina ───────── fato_cvu_usinas_termicas
  └── dim_subsistema (FK)
```

### Tabelas e cobertura temporal

| Tabela | Fonte CSV | Período | Granularidade |
|---|---|---|---|
| `fato_balanco_energia_horario` | `balanco_energia_subsistemas.csv` | 2000-01-01 → 2024-02-29 | Horária |
| `fato_balanco_energia_dessem` | `balanco_energia_subsistemas_dessem.csv` | 2020-01-01 → 2024-03-03 | Semi-horária |
| `fato_cmo_semanal` | `custo_marginal_operacao_semanal.csv` | 2005-01-01 → 2024-03-08 | Semanal |
| `fato_cmo_semi_horario` | `custo_marginal_operacao_semi_horario.csv` | 2020-01-01 → 2024-03-03 | Semi-horária |
| `fato_cvu_usinas_termicas` | `custo_variavel_unitario_usinas_termicas.csv` | 2019-12-28 → 2024-03-02 | Semanal |

> Valores de energia são armazenados em **Wh** como `BIGINT` (chegam a ~10¹³). A conversão para TWh (`÷ 1e12`) é feita na camada de serviço.

## API — Backend

Documentação interativa: `http://localhost:8000/docs`

### Endpoints KPI

Todos aceitam `dataInicio`, `dataFim` (obrigatórios) e `subsistema` (opcional).

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/kpis/cmo-semanal` | CMO semanal por subsistema |
| GET | `/api/kpis/balanco-horario` | Balanço energético por fonte |
| GET | `/api/kpis/renovavel` | % de energia renovável |
| GET | `/api/kpis/perfil-demanda` | Perfil intradiário de demanda |
| GET | `/api/kpis/cvu-usinas` | Top usinas por CVU |
| GET | `/api/kpis/intercambio` | Intercâmbio entre subsistemas |

### Formato de resposta KPI

Todos os endpoints KPI retornam `PaginatedResponse[T]` com campo `coverage`:

```json
{
  "items": [...],
  "total": 847,
  "coverage": {
    "data_inicio_solicitada": "2003-01-01",
    "data_fim_solicitada":    "2022-12-31",
    "data_inicio_efetiva":    "2005-01-01",
    "data_fim_efetiva":       "2022-12-31",
    "cobertura_completa":     false
  }
}
```

### Endpoints Meta

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/meta/subsistemas` | Lista de subsistemas |
| GET | `/api/meta/usinas` | Lista de usinas |
| GET | `/api/meta/cobertura` | Período disponível por dataset (MIN/MAX de data) |

### Endpoints Admin

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/admin/kpi-config` | Lista todos os KPIs |
| GET | `/api/admin/kpi-config/active` | Lista KPIs com `visivel=true` |
| POST | `/api/admin/kpi-config` | Cria novo KPI |
| PATCH | `/api/admin/kpi-config/{id}` | Atualiza KPI |
| DELETE | `/api/admin/kpi-config/{id}` | Remove KPI |

### Healthcheck

```
GET /health  →  { "status": "ok" }
```

---

## Frontend

### KpiResponse e cobertura

Todos os hooks de KPI retornam `KpiResponse<T>` em vez de array direto:

```ts
interface KpiResponse<T> {
  items: T[];
  total: number;
  coverage: DataCoverage | null;
}

// Uso nos componentes:
const { data: response } = useCmoSemanal(params);
const data     = response?.items ?? [];
const coverage = response?.coverage ?? null;
```

### Filtros globais — draft/commit

O `filtersStore` usa padrão draft/commit: alterações nos inputs ficam no `draft` e só são aplicadas aos gráficos quando o usuário clica em **"Aplicar Filtros"**. Isso evita múltiplas requisições enquanto o usuário ainda está ajustando as datas.

```ts
// Mudar data não dispara query
store.setDraftDateRange('2021-01-01', '2021-12-31');

// Só aqui os gráficos atualizam
store.applyFilters();
```

### Hook `useChartConfig`

```ts
const cfg = useChartConfig('cmo-semanal');
// cfg.cor      → cor de acento para markLine (não afeta séries)
// cfg.unidade  → unidade no tooltip/eixo
// cfg.meta     → valor de referência (linha tracejada)
// cfg.decimais → casas decimais na formatação
```

### Modo mock

Com `VITE_USE_MOCKS=true`, todos os hooks retornam dados de `src/__mocks__/` sem fazer chamadas HTTP. Útil para desenvolvimento frontend sem backend rodando.

### Rótulos Dinâmicos de Período (KPI Cards)

Os subtítulos dos cards de KPI (CMO, Renovável, Carga) são atualizados dinamicamente para refletir o período efetivamente selecionado pelos filtros. O frontend utiliza a chave `periodLabel` do `i18next` em conjunto com a função `formatDate` para exibir `DD/MM/YYYY → DD/MM/YYYY` (em pt-BR), substituindo textos estáticos de contexto por informações sempre sincronizadas com a busca global do usuário.

---

## Cobertura Temporal de Dados

O sistema implementa **clip explícito com metadata** para lidar com datasets de períodos diferentes:

### CoverageWarning (filter bar)

Compara o período selecionado com `GET /api/meta/cobertura` e exibe um aviso colapsável listando quais datasets têm cobertura parcial ou ausente para o período escolhido.

### CoverageNote (por gráfico)

Exibida abaixo do título de cada gráfico quando `coverage.cobertura_completa === false`. Mostra o período efetivo dos dados retornados:

```
⚠️ Dados disponíveis de 01/01/2005 até 08/03/2024
```

### build_coverage() — backend

Helper em `backend/app/main/core/coverage.py` que compara o período solicitado com as datas efetivas dos resultados:

```python
coverage = build_coverage(
    data_inicio_solicitada=data_inicio,
    data_fim_solicitada=data_fim,
    datas_efetivas=[r.data for r in results],
)
```

Para mais detalhes sobre os conceitos por trás dessa implementação, ver [`DADOS_TEMPORAIS.md`](./DADOS_TEMPORAIS.md).

---

## Painel Administrativo

Acessível em `/admin`.

### KpiEditor — config_json

```json
{
  "cor":      "#EC4899",
  "unidade":  "TWh",
  "meta":     5000,
  "decimais": 2
}
```

| Campo | Efeito |
|---|---|
| `cor` | Cor de acento da linha de referência. **Não** afeta as séries do gráfico |
| `unidade` | Unidade exibida em tooltips e rótulos de eixo |
| `meta` | Valor numérico → linha tracejada horizontal (ou vertical no CVU) |
| `decimais` | Casas decimais na formatação de valores |

---

## Internacionalização

Arquivos de locale em `frontend/src/i18n/locales/`:
- `pt-BR.json` — Português (padrão)
- `en-US.json` — Inglês

A detecção é automática via `i18next-browser-languagedetector` (prioridade: `localStorage` → `navigator.language`). A chave de storage é `igeos-lang`.

---

## Utilitários

### `src/utils/formatDate.ts`

Formata strings ISO `YYYY-MM-DD` no formato local do idioma ativo usando `Intl.DateTimeFormat`:

```ts
import { formatDate } from '../utils/formatDate';

formatDate('2024-03-08', 'pt-BR')  // → "08/03/2024"
formatDate('2024-03-08', 'en-US')  // → "03/08/2024"
```

Usado em `CoverageNote` e `CoverageWarning` para exibir datas no formato correto conforme o idioma selecionado.

---

## Decisões de Projeto

### Por que clip explícito e não rejeição hard?

Rejeitar com `400 Bad Request` quando o período está fora da cobertura seria muito agressivo para um dashboard exploratório. O usuário precisa poder explorar livremente — o sistema informa o que está disponível sem bloquear.

### Por que ECharts para a maioria e Recharts no CmoPatamares?

ECharts oferece `markLine`, paleta automática e performance superiores. Recharts foi mantido no `CmoPatamares` por já estar implementado com `ReferenceLine` declarativa JSX-friendly — refatorar não traria ganho real.

### Por que draft/commit nos filtros?

Evita disparar N queries enquanto o usuário ainda está ajustando o período. Sem o padrão draft, cada keystroke no input de data dispararia uma nova requisição.
