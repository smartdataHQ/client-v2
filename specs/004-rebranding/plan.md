# Implementation Plan: FraiOS Semantic Layer Rebranding

**Branch**: `004-rebranding` | **Date**: 2026-03-07 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/004-rebranding/spec.md`

## Summary

Rebrand the Synmetrix Client application as "FraiOS Semantic Layer" by
replacing all visual identity elements (logos, favicon, OG tags),
migrating the purple color system to FraiOS blue, updating typography
from Manrope to Lato/Inter, applying glass morphism to key layout
surfaces, and removing all user-facing Synmetrix text references.

## Technical Context

**Language/Version**: TypeScript 5 + React 18
**Primary Dependencies**: Ant Design 5, Vite 4, LESS, CSS Modules
**Storage**: N/A (no data model changes)
**Testing**: Vitest + Testing Library
**Target Platform**: Web (modern browsers)
**Project Type**: Single-page web application
**Performance Goals**: No degradation from current — glass morphism
backdrop-blur must not cause visible jank on mid-range devices
**Constraints**: Must not modify backend service names (nginx.conf
proxy targets), must preserve existing component functionality
**Scale/Scope**: ~35 LESS files, ~10 TSX files, ~33 SVG assets,
1 HTML file, 2 config files (~80 files total)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Blueprint Alignment (FraiOS-First)

- **PASS**: This feature directly advances FraiOS alignment by adopting
  FraiOS visual identity, color system, typography, and glass morphism
  design language.

### II. Type Safety

- **PASS**: No new types introduced. Existing TypeScript interfaces
  unchanged. Color constants in `colors.ts` remain typed string arrays.

### III. Component Conventions

- **PASS**: All changes follow existing component structure
  (`ComponentName/index.tsx` + `index.module.less`). No new components
  created — only modifications to existing ones.

### IV. Testing Discipline

- **PASS**: Visual regression testing via Storybook. Build validation
  via `bun run build`. Lint validation via `bun run lint`. No new
  behavioral logic requiring unit tests.

### V. Simplicity

- **PASS**: Minimal changes per file — primarily value replacements
  (colors, fonts, asset paths, text strings). Glass morphism adds CSS
  properties to existing selectors rather than new abstractions.

## Project Structure

### Documentation (this feature)

```text
specs/004-rebranding/
├── plan.md              # This file
├── research.md          # Branding audit and color mapping
├── data-model.md        # Token replacement tables
├── quickstart.md        # Validation guide
└── tasks.md             # Phase 2 output (via /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── global.less                          # CSS custom properties (color + font tokens)
├── layouts/
│   └── RootLayout.tsx                   # Ant Design theme (colorPrimary, fontFamily)
├── components/
│   ├── SideMenu/
│   │   ├── index.tsx                    # Logo import
│   │   └── index.module.less            # Sidebar background, glass morphism
│   ├── Header/
│   │   ├── index.tsx                    # Logo import
│   │   └── index.module.less            # Header background, glass morphism
│   ├── Navbar/
│   │   ├── index.tsx                    # Docs link URL
│   │   └── index.module.less            # Docs button color
│   ├── Sidebar/
│   │   └── index.module.less            # Right sidebar background, glass morphism
│   ├── Footer/
│   │   └── index.tsx                    # Copyright text (commented)
│   ├── ModelsSidebar/index.module.less  # Hardcoded purple
│   ├── CodeEditor/index.module.less     # Hardcoded purple
│   ├── AlertForm/index.module.less      # Hardcoded purple
│   ├── ReportForm/index.module.less     # Hardcoded purple
│   ├── PageHeader/index.module.less     # Hardcoded purple
│   ├── RestAPI/index.module.less        # Hardcoded purple
│   ├── DataSourcesMenu/index.module.less # Hardcoded purple
│   ├── VersionsList/index.module.less   # Hardcoded purple
│   ├── BranchSelection/index.module.less # rgba purple
│   ├── ExploreCubes/index.module.less   # rgba purple
│   ├── ExploreCubesCategoryItem/index.module.less
│   ├── ExploreDataSection/index.module.less
│   ├── ExploreSegmentsSection/index.module.less
│   ├── ExploreCubesCategoryItemFilter/index.module.less
│   ├── ExploreFiltersSection/index.module.less
│   ├── Input/index.module.less
│   ├── RequestInfo/index.module.less
│   ├── QueryFilters/index.module.less
│   ├── SQLRunner/index.module.less
│   ├── FormTile/index.module.less
│   ├── SignInForm/index.module.less
│   ├── SignUpForm/index.module.less
│   ├── LogoutSessions/index.module.less
│   ├── DataSourceSetup/index.module.less
│   ├── DataModelGeneration/index.module.less
│   ├── SidebarMenu/index.module.less
│   ├── StepFormHeader/index.module.less
│   ├── ApiSetup/index.module.less
│   └── VirtualTable/index.module.less
├── pages/
│   ├── Members/index.module.less        # Hardcoded purple
│   ├── Callback/index.module.less       # Purple
│   ├── ExportModels/index.module.less   # Purple
│   ├── Logout/index.module.less         # Purple
│   └── Teams/index.tsx                  # Avatar colors + Tag colors
├── components/ (additional TSX with hardcoded colors)
│   ├── TeamsTable/index.tsx             # Avatar colors + Tag colors
│   ├── VersionPreview/index.tsx         # Badge color="#A31BCB"
│   ├── AlertForm/index.tsx              # starColor="#A31BCB"
│   ├── ReportForm/index.tsx             # starColor="#A31BCB"
│   └── NestedTag/index.stories.tsx      # Story color examples
├── utils/
│   └── constants/
│       ├── colors.ts                    # Chart color constants
│       └── links.ts                     # docs.synmetrix.org URLs
├── assets/                              # ~33 SVG icons with hardcoded purple
│   ├── alert-close.svg, alert.svg       # #470D69
│   ├── branch-colored.svg, copy.svg     # #470D69, #A31BCB
│   ├── member-*.svg (9 files)           # #470D69
│   ├── report.svg, save.svg, send.svg   # #470D69, #A31BCB
│   └── ... (see research.md for full list)
├── mocks/
│   ├── members.ts                       # Mock emails
│   └── request.ts                       # Mock path
index.html                               # Title, favicon, OG tags
package.json                              # Package name
```

**Structure Decision**: Single project, frontend-only. All changes are
CSS/LESS value replacements, asset swaps, and text string updates
within the existing `src/` structure. No new directories or files
needed.

## Complexity Tracking

> No constitution violations. No complexity justifications needed.
