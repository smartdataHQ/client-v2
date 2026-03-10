<!--
Sync Impact Report
===================
Version change: 0.0.0 -> 1.0.0
Bump rationale: MAJOR - initial constitution ratification

Modified principles: N/A (first version)

Added sections:
  - Core Principles (5 principles)
  - Technology Constraints
  - Development Workflow
  - Governance

Removed sections: N/A

Templates requiring updates:
  - .specify/templates/plan-template.md: constitution check section
    references "[Gates determined based on constitution file]" which is
    generic and compatible with any constitution content. No update needed.
  - .specify/templates/spec-template.md: no constitution references.
    No update needed.
  - .specify/templates/tasks-template.md: no constitution references.
    No update needed.

Follow-up TODOs: None
-->

# FraiOS Semantic Layer Constitution

## Core Principles

### I. Blueprint Alignment (FraiOS-First)

All new features and architectural decisions MUST align with FraiOS
(`../cxs2`) target patterns where feasible. Specifically:

- New auth work MUST use WorkOS AuthKit patterns (JWT in cookies,
  session hooks via TanStack Query), not hasura-backend-plus patterns.
- New state management MUST separate server state (TanStack Query)
  from client state (Zustand). Do not add new localStorage-persisted
  server state to Zustand stores.
- New styling MUST use Tailwind CSS 4 utilities. Do not introduce new
  LESS or WindiCSS files.
- When FraiOS alignment conflicts with shipping deadlines, document
  the deviation in the feature's plan.md under "Complexity Tracking"
  and create a follow-up migration task.

**Rationale**: The project is actively migrating toward FraiOS patterns.
Every new deviation increases migration debt.

### II. Type Safety

All code MUST be fully typed. Specifically:

- No `any` types unless explicitly justified with a `// eslint-disable`
  comment explaining why.
- GraphQL operations MUST use generated types from `bun run codegen`.
  Never hand-write GraphQL response types.
- Component props MUST have explicit TypeScript interfaces (not inline
  object types) when the component is exported.

**Rationale**: The GraphQL codegen pipeline and TypeScript strict mode
are the primary defense against contract drift between frontend and
backend.

### III. Component Conventions

Every component MUST follow the established structure:

- `src/components/ComponentName/index.tsx` for implementation.
- `src/components/ComponentName/index.module.less` (or Tailwind) for
  styles, using camelCase class names.
- Storybook stories (`index.stories.tsx`) MUST exist for any
  reusable UI component.
- Components MUST be functional components (React FC). No class
  components.

**Rationale**: Consistent structure enables codebase navigation,
automated tooling, and onboarding.

### IV. Testing Discipline

- All bug fixes MUST include a regression test.
- New hooks and utility functions MUST have unit tests (Vitest).
- Integration tests are REQUIRED for: GraphQL query/mutation flows,
  auth token lifecycle, and multi-step wizard flows.
- Tests MUST run and pass before any PR is merged (`bun run test`).

**Rationale**: The codebase manages sensitive auth flows, financial
data models, and real-time subscriptions. Untested changes risk
cascading failures.

### V. Simplicity

- Start with the simplest solution that meets requirements.
- Do not add abstractions, utilities, or helpers for one-time
  operations. Three similar lines of code is better than a premature
  abstraction.
- Do not add features, configurability, or error handling beyond what
  is explicitly requested.
- Prefer editing existing files over creating new ones.

**Rationale**: Over-engineering is the primary source of unnecessary
complexity in frontend codebases. YAGNI applies.

## Technology Constraints

The following technology choices are non-negotiable for the current
codebase and MUST NOT be changed without a constitution amendment:

| Layer | Current | Target (FraiOS) |
|---|---|---|
| Framework | React 18 + Vite 4 | Next.js 16 App Router |
| UI Library | Ant Design 5 | Ant Design 5 (retained) |
| GraphQL Client | URQL | Convex + TanStack Query 5 |
| State | Zustand 4 | Zustand 5 + TanStack Query |
| Styling | LESS + CSS Modules + WindiCSS | Tailwind CSS 4 |
| Auth | hasura-backend-plus | WorkOS AuthKit |
| Testing | Vitest + Testing Library | Vitest + Testing Library |
| Package Manager | Bun | Bun |

- New dependencies MUST be justified in the PR description.
- Do not introduce competing libraries for an already-covered concern
  (e.g., no Axios when URQL/fetch exists, no MobX when Zustand exists).

## Development Workflow

### Code Quality Gates

Every PR MUST pass these gates before merge:

1. `bun run lint` -- zero errors (warnings acceptable if pre-existing).
2. `bun run test` -- all tests pass.
3. `bun run build` -- production build succeeds.
4. TypeScript compilation -- zero type errors.

### GraphQL Schema Change Protocol

When backend schema changes occur:

1. Run `bun run loadschema` to re-introspect.
2. Update `.gql` files as needed.
3. Run `bun run codegen` to regenerate types.
4. Never commit hand-edited `src/graphql/generated.ts`.

### Branch and Commit Conventions

- Feature branches: `###-feature-name` (issue number prefix).
- Commit messages: conventional commits (`feat:`, `fix:`, `docs:`,
  `refactor:`, `test:`, `chore:`).
- Keep commits atomic -- one logical change per commit.

## Governance

This constitution supersedes all ad-hoc practices. All PRs and code
reviews MUST verify compliance with the principles above.

### Amendment Procedure

1. Propose amendment via PR modifying this file.
2. Document rationale for the change.
3. Update version using semantic versioning:
   - MAJOR: principle removal or incompatible redefinition.
   - MINOR: new principle or material expansion.
   - PATCH: wording clarification or typo fix.
4. Update `LAST_AMENDED_DATE` to the amendment date.
5. Run the consistency propagation checklist (review plan, spec,
   and tasks templates for alignment).

### Compliance Review

- Every feature spec (`/speckit.specify`) MUST reference applicable
  principles.
- Every implementation plan (`/speckit.plan`) MUST include a
  Constitution Check gate validating alignment with these principles.
- Complexity that violates a principle MUST be justified in the plan's
  Complexity Tracking table.

**Version**: 1.0.0 | **Ratified**: 2026-03-07 | **Last Amended**: 2026-03-07
