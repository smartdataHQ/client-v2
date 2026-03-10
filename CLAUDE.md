# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Synmetrix Client — the frontend for the Synmetrix data engineering platform. Provides data modeling (IDE with Monaco editor), analytics exploration, alerts/reports, team management, and role-based access control.

**Related repositories:**
- **Synmetrix backend** (`../synmetrix`) — Actions service, CubeJS, Hasura, Docker orchestration. See its CLAUDE.md for backend architecture.
- **FraiOS blueprint** (`../cxs2`) — Master UI application whose patterns this project will adopt. See "Blueprint: FraiOS" below.

## Development Commands

```bash
bun install                      # Install dependencies
bun run dev                      # Dev server on port 8000 (proxies to local backend)
bun run dev:force                # Dev server with Vite cache cleared
bun run build                    # Production build (outputs dist/, then tar.gz + zip)
bun run lint                     # ESLint + TypeScript check
bun run lint:fix                 # Auto-fix ESLint issues
bun run test                     # Run Vitest tests
bun run codegen                  # Regenerate GraphQL types from Hasura schema
bun run loadschema               # Introspect Hasura and dump schema JSON
bun run storybook                # Component dev on port 6007
bun run prettier                 # Format code
```

**Note:** `bun run` and `yarn` both work — the project uses Bun as package manager but scripts are compatible with either.

## Tech Stack

- **React 18** + TypeScript 5, built with **Vite 4** + `@vitjs/vit` (file-based routing)
- **Ant Design 5** — Primary UI library with ConfigProvider theming (`colorPrimary: #470D69`)
- **URQL** — GraphQL client with `authExchange`, `retryExchange`, `subscriptionExchange` (WebSocket)
- **Zustand 4** — State management (3 stores: `AuthTokensStore`, `CurrentUserStore`, `DataSourceStore`)
- **Monaco Editor** — Code editing for Cube.js data models (YAML/JS)
- **LESS + CSS Modules + WindiCSS** — Styling (components use `index.module.less`, camelCase class names)
- **i18next** — Internationalization (English, Russian)
- **GraphQL CodeGen** — Generates TypeScript types + URQL hooks → `src/graphql/generated.ts`
- **Vitest** + Testing Library — Unit tests
- **Storybook 7** — Component development

## Architecture

### Routing

Routes defined in `config/routes.ts` using `@vitjs/vit`. Layout hierarchy:

```
RootLayout (URQL provider, Ant Design config, i18n)
├── /auth/signin, /auth/signup, /auth/logout — BasicLayout (unauthenticated)
├── /callback — OAuth callback handler
└── UserDataWrapper (authenticated, fetches user/team data)
    ├── /models/:dataSourceId?/:branch?/:slug? — Models IDE
    ├── /explore/:dataSourceId?/:explorationId? — Analytics Explorer
    ├── /signals/alerts, /signals/reports — SettingsLayout
    ├── /settings/* — SettingsLayout (teams, sources, members, roles, sql-api, info)
    ├── /onboarding/:step? — Setup wizard
    ├── /logs/query — Query logs
    └── /docs/:versionId — Schema documentation viewer
```

### Backend Communication

All requests route through **4 proxy paths** (Vite dev server proxies to local Docker services; Nginx in production):

| Frontend Path | Backend Target | Service |
|---|---|---|
| `/v1/graphql` | `http://localhost:8080` | Hasura GraphQL (queries, mutations, subscriptions) |
| `/v1/ws` | `ws://localhost:8080` | Hasura WebSocket (live subscriptions, rewritten to `/v1/graphql`) |
| `/auth/*` | `http://localhost:8081` | hasura-backend-plus (login, register, token refresh) |
| `/api/v1/*` | `http://localhost:4000` | CubeJS REST API (run-sql, test, get-schema, generate-models) |

Proxy config in `vite.config.ts` lines 97-108. Production proxy via Nginx (`services/client/nginx/`).

### GraphQL Layer

- **Queries/mutations** defined in `src/graphql/gql/*.gql` (16 files: users, datasources, alerts, reports, explorations, teams, members, branches, schemas, versions, etc.)
- **Schema source**: `src/graphql/schemas/hasura.json` (Hasura introspection dump)
- **Generated code**: `src/graphql/generated.ts` (~503KB) — TypeScript types + URQL hooks
- **Codegen config**: `codegen.yaml` — plugins: `typescript`, `typescript-operations`, `typescript-urql`, `named-operations-object`

**Workflow for schema changes:**
1. Backend applies Hasura migration
2. Run `bun run loadschema` to re-introspect
3. Update `.gql` files if needed
4. Run `bun run codegen` to regenerate types

### GraphQL Actions Bridge

The frontend never calls the Actions service directly. When calling mutations like `gen_dataschemas` or `run_query`, Hasura forwards them as **Actions** to `POST http://actions:3000/rpc/{method}`. The frontend only calls CubeJS directly for REST endpoints (`/api/v1/*`).

### Authentication

**Current flow** (via hasura-backend-plus):
1. `POST /auth/login` → `jwt_token` + `refresh_token`
2. Tokens stored in Zustand `AuthTokensStore` (persisted to localStorage via `zustand/middleware/persist`)
3. JWT decoded — extracts `x-hasura-user-id` and `x-hasura-role` from `hasura` namespace
4. URQL `authExchange` (`src/URQLClient.ts`) attaches `Authorization: Bearer {token}` + `x-hasura-role: user` headers
5. On expiry, `willAuthError` triggers → `GET /auth/token/refresh?refresh_token={token}`
6. On `FORBIDDEN` error, `didAuthError` triggers refresh

Auth endpoints may use `window.GRAPHQL_PLUS_SERVER_URL` or `VITE_GRAPHQL_PLUS_SERVER_URL` env var.

### State Management

**Zustand stores** (`src/stores/`):
- `AuthTokensStore` — `accessToken`, `refreshToken`, `JWTpayload`; persisted to localStorage
- `CurrentUserStore` — `currentUser`, `currentTeam`, `teamData`, `loading`; team selection persisted via `lastTeamId` in localStorage
- `DataSourceStore` — Multi-step datasource setup wizard state (`step`, `branchId`, `formState`, `isGenerate`, `isOnboarding`)

### Component Conventions

Each component follows the structure:
```
src/components/ComponentName/
  index.tsx           # React FC implementation
  index.module.less   # Scoped styles (camelCase class names)
  index.stories.tsx   # Storybook stories
  index.test.tsx      # Vitest tests (optional)
```

### Key Hooks

- `useAuth()` (`src/hooks/useAuth.ts`) — Login, register, logout, password change, token refresh
- `useModelsIde()` — Models IDE state (editor, schema tree, compile)
- `usePlayground()` — SQL playground state
- `useAnalyticsQuery()` — Query builder state management
- `useExploreWorkspace()` — Exploration workspace orchestration
- `useSources()` — Data source CRUD operations
- `useAlerts()` / `useReports()` — Signal management
- `useUserData()` — Current user and team data loading
- `useOnboarding()` — Onboarding wizard flow
- `useDataSourcesMeta()` — Cube metadata resolution and query member enrichment

### Environment Configuration

```bash
# .env (development)
VITE_HASURA_GRAPHQL_ENDPOINT=/v1/graphql
VITE_HASURA_WS_ENDPOINT=/v1/ws
VITE_CUBEJS_REST_API_URL=/api/v1/load
VITE_CUBEJS_MYSQL_API_URL=localhost:13306
VITE_CUBEJS_PG_API_URL=localhost:15432
```

Production endpoints configured in `.env.production`. Runtime overrides via `window.*` globals (injected by Nginx template).

## Shared Contracts with Backend (`../synmetrix`)

Changes to these backend files require corresponding frontend updates:
- **Hasura actions** (`services/hasura/metadata/actions.yaml`, `actions.graphql`) → update `.gql` files, run `bun run codegen`
- **Hasura migrations** (new tables/columns) → run `bun run loadschema`, update `.gql` queries, run `bun run codegen`
- **JWT claims structure** → `AuthTokensStore.ts` expects `hasura` namespace with `x-hasura-user-id` and `x-hasura-role`
- **CubeJS REST routes** (`services/cubejs/src/routes/`) → called directly via `/api/v1/*`

## Blueprint: FraiOS (`../cxs2`)

FraiOS (currently `cxs2`) is the **master UI blueprint**. This client-v2 project will adopt patterns from FraiOS. When making architectural decisions, refer to cxs2 as the target.

### Target Architecture (from FraiOS)

| Current (client-v2) | Target (FraiOS pattern) |
|---|---|
| Vite + @vitjs/vit routing | Next.js 16 App Router |
| React 18 | React 19 |
| hasura-backend-plus (JWT in localStorage) | WorkOS AuthKit (JWT in cookies, Redis sessions) |
| Hasura row-level security + `member_roles.access_list` | WorkOS FGA (Fine-Grained Authorization) |
| Plaintext datasource credentials | WorkOS Vault (encrypted credential storage) |
| URQL GraphQL client | Convex real-time database + TanStack Query 5 |
| Zustand 4 (3 stores, localStorage persist) | Zustand 5 + TanStack Query (server state separation) |
| LESS + CSS Modules + WindiCSS | Tailwind CSS 4 |

### Key FraiOS Patterns to Adopt

**WorkOS Authentication:**
- AuthKit login → JWT in cookies → Redis session with sliding TTL
- `useSession()` hook via TanStack Query (replaces localStorage token management)
- Session includes `can()`/`cannot()` methods for inline permission checks
- Reference: `cxs2/src/lib/auth/session.ts`

**WorkOS FGA (Fine-Grained Authorization):**
- `check(membershipId, permissionSlug, resourceType?, resourceId?)` with Redis caching (5min TTL)
- Batch permission checks (50 per batch)
- Roles assigned to organization memberships, not users directly
- Replaces current `access_list.config.datasources[id].cubes` system
- Reference: `cxs2/src/lib/auth/authorization.ts`

**WorkOS Vault:**
- Encrypted storage for datasource credentials and API keys
- `vault.store()` / `vault.get()` / `vault.update()` with merge semantics and optimistic locking
- Reference: `cxs2/src/lib/services/vault.ts`

**Convex:**
- Real-time database with reactive React hooks (`useQuery`, `useMutation`, `useAction`)
- Zod-validated function wrappers (`zQuery`, `zMutation`, `zAction`)
- Auth helpers: `getCurrentUser()`, `requireAuth()`, `requireOrgAuth()`
- FGA checks must be in Convex **actions** (not queries/mutations) since they call external APIs
- Reference: `cxs2/convex/schema.ts`, `cxs2/convex/lib/functions.ts`, `cxs2/convex/lib/auth.ts`

**TanStack Query + Centralized Query Keys:**
- Query key factory pattern for consistent caching/invalidation
- Reference: `cxs2/src/lib/query-keys.ts`

### Key cxs2 File Locations
- `src/lib/auth/session.ts` — Session management (Redis + WorkOS)
- `src/lib/auth/authorization.ts` — FGA client with caching
- `src/lib/services/vault.ts` — WorkOS Vault integration
- `convex/schema.ts` — Database schema
- `convex/lib/functions.ts` — Zod-wrapped query/mutation/action helpers
- `convex/lib/auth.ts` — Auth guards and user resolution
- `convex/lib/fga.ts` — FGA permission checks (action-only)
- `src/components/providers/ConvexProvider.tsx` — Custom Convex auth provider
- `src/lib/query-keys.ts` — TanStack Query key factory
- `src/contexts/team-context.tsx` — Team selection and permissions

## Active Technologies
- TypeScript 5 + React 18 + Ant Design 5, Vite 4, LESS, CSS Modules (004-rebranding)
- N/A (no data model changes) (004-rebranding)

## Recent Changes
- 004-rebranding: Added TypeScript 5 + React 18 + Ant Design 5, Vite 4, LESS, CSS Modules
