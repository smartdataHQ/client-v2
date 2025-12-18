# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Essential Commands

### Development
- `npm run dev` - Start development server at http://localhost:8000 with Vite
- `npm run dev:force` - Start dev server with force flag to clear cache
- `npm start` - Alias for `npm run dev`

### Testing
- `npm test` - Run tests using Vitest
- Tests use jsdom environment with setup file at `tests.setup.ts`

### Linting & Type Checking
- `npm run lint` - Run ESLint and TypeScript compiler checks
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run prettier` - Check and format code with Prettier

### Building
- `npm run build` - Build production bundle with Vite
- `npm run postbuild` - Create compressed archives (dist.tar.gz, dist.zip)
- `npm run serve` - Preview built app locally

### GraphQL
- `npm run codegen` - Generate TypeScript types from GraphQL schema
- `npm run codegen:watch` - Watch mode for GraphQL code generation
- `npm run loadschema` - Load GraphQL schema from local Hasura instance

### Storybook
- `npm run storybook` - Start Storybook dev server at http://localhost:6007
- `npm run build-storybook` - Build Storybook for production

## Architecture Overview

### Tech Stack
- **React 18** with TypeScript
- **Vite** for build tooling and development
- **URQL** for GraphQL client with auth, retry, and subscription exchanges
- **Ant Design** as primary UI component library
- **Zustand** for state management
- **WindiCSS** for utility-first CSS
- **i18next** for internationalization (en, ru, zh)
- **Monaco Editor** for code editing capabilities
- **Vitest** and Testing Library for testing

### Project Structure

#### Core Directories
- `src/components/` - Reusable UI components following consistent structure:
  - `index.tsx` - Component implementation
  - `index.module.less` - Component-scoped styles  
  - `index.stories.tsx` - Storybook stories
  - `index.test.tsx` - Unit tests
- `src/pages/` - Route-level page components
- `src/layouts/` - Layout wrapper components (RootLayout, AppLayout, SettingsLayout, etc.)
- `src/hooks/` - Custom React hooks for business logic
- `src/stores/` - Zustand stores for global state
- `src/types/` - TypeScript type definitions
- `src/utils/` - Utility functions and constants
- `src/graphql/` - GraphQL queries (.gql files) and generated types
- `src/mocks/` - Mock data for development and testing

#### Key Files
- `src/URQLClient.ts` - GraphQL client configuration with auth handling
- `config/routes.ts` - Application routing configuration using @vitjs/vit
- `src/global.ts` & `src/global.less` - Global application setup and styles
- `codegen.yaml` - GraphQL Code Generator configuration

### Backend Integration
- **GraphQL API** via Hasura at `/v1/graphql` (proxied in development)
- **WebSocket subscriptions** at `/v1/ws` for real-time updates  
- **Auth service** at `/auth` for authentication flows
- **Backend API** at `/api/v1` for additional services

### Development Workflow
- Uses Husky for Git hooks with lint-staged for pre-commit linting
- Semantic Release for automated versioning and releases
- Conventional Commits specification for commit messages
- Component development with Storybook for isolated testing
- Comprehensive test coverage with Vitest

### Data Model Context
This is the frontend for Synmetrix, a data analytics platform that provides:
- Data source connections and management
- Data modeling and schema generation  
- Interactive data exploration and querying
- Alerting and reporting capabilities
- Team collaboration and access control
- Multi-tenant architecture with role-based permissions

### Special Considerations
- The app supports multiple data source types (databases listed in `src/assets/databases/`)
- Features branch-based data model versioning
- Includes sophisticated query building and visualization capabilities
- Monaco Editor integration for SQL and YAML editing
- Internationalization support for multiple languages
- Real-time collaborative features via GraphQL subscriptions