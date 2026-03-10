# Tasks: FraiOS Semantic Layer Rebranding

**Input**: Design documents from `/specs/004-rebranding/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md

**Tests**: No test tasks included — spec does not request TDD. Validation is via visual inspection, `bun run build`, `bun run lint`, and Storybook.

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

---

## Phase 1: Setup

**Purpose**: No project initialization needed — working within existing codebase. This phase adds font dependencies.

- [x] T001 Add Google Fonts link for Lato and Inter to `index.html` (add `<link>` tags in `<head>` for `https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600;700&family=Lato:wght@300;400;700;900&display=swap`)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Update central token definitions that all user stories depend on. These changes cascade to 21+ components via CSS variables and Ant Design theme.

**CRITICAL**: No user story work can begin until this phase is complete.

- [x] T002 Update CSS custom properties in `src/global.less`: change `--color-primary: #470d69` to `#3f6587`, `--color-mediumpurple: #a56edd` to `#5a8ab5`, `--color-darkorchid: #b65cf8` to `#6ba3d6`, `--color-dimgray-100: #463854` to `#3a4f63`, `--color-dimgray-200: rgba(70, 56, 84, 0.2)` to `rgba(58, 79, 99, 0.2)`, `--color-dimgray-300: rgba(70, 56, 84, 0.1)` to `rgba(58, 79, 99, 0.1)`, `--color-whitesmoke: #e9e8ee` to `#e8edf2`
- [x] T003 Update Ant Design theme tokens in `src/layouts/RootLayout.tsx`: change `colorPrimary: "#470D69"` to `"#3f6587"` and `fontFamily: "Manrope"` to `"Inter"`
- [x] T004 Replace Manrope `@font-face` declarations in `src/global.less` with Lato and Inter `@font-face` declarations (or remove them if using Google Fonts CDN from T001). Update `--font-manrope` variable to `--font-inter: "Inter"` and add `--font-lato: "Lato"`. Update body `font-family` rule to use Inter and heading rules (`h1-h5`) to use Lato.

**Checkpoint**: Foundation ready — CSS variables, Ant Design theme, and fonts updated. All 21 component LESS files using `var(--color-primary)` automatically reflect new blue color.

---

## Phase 3: User Story 1 - Visual Identity Replacement (Priority: P1) MVP

**Goal**: Replace all Synmetrix logos, favicon, page title, and OG metadata with FraiOS branding.

**Independent Test**: Load the application — browser tab shows FraiOS pinwheel favicon and "FraiOS Semantic Layer" title. Header shows FraiOS full logo. Sidebar shows FraiOS pinwheel icon. Sharing a link previews FraiOS OG metadata.

### Implementation for User Story 1

- [x] T005 [P] [US1] Update `index.html`: change `<link rel="icon">` href from `/logo.png` to `/FraioS-icon-lighttheme.svg`, change `type` from `image/png` to `image/svg+xml`
- [x] T006 [P] [US1] Update `index.html`: change `<title>` from "Synmetrix: seamlessly connect, analyze, and innovate with the Metrics Store" to "FraiOS Semantic Layer"
- [x] T007 [P] [US1] Update `index.html`: change all `<meta>` description content from Synmetrix descriptions to FraiOS Semantic Layer descriptions (lines 8, 12, 15, 17, 20, 22 — og:title, og:description, twitter:title, twitter:description, and general description/keywords)
- [x] T008 [P] [US1] Update `index.html`: change `<meta property="og:image">` and `<meta property="twitter:image">` from `/og.png` to `/Frai-OSAppIcon.png`
- [x] T009 [US1] Update `src/components/Header/index.tsx`: change logo import from `import logo from "@/assets/logo_with_text.png"` to import `FraioS-logo-lighttheme.svg` from `/public/` (or as a static path). Update the `<img>` tag `src` and ensure SVG renders at appropriate size within `.logo` / `.logoText` constraints
- [x] T010 [US1] Update `src/components/SideMenu/index.tsx`: change logo `src` from `"/logo_bg.png"` to `"/FraioS-icon-lighttheme.svg"`. Adjust `.logo` max-width in `src/components/SideMenu/index.module.less` if needed for SVG sizing (current: 40px)
- [x] T011 [US1] Update `package.json`: change `"name"` from `"synmetrix-client"` to `"fraios-semantic-layer"`

**Checkpoint**: Visual identity fully replaced. FraiOS logos, favicon, title, and OG tags all active.

---

## Phase 4: User Story 2 - Color System Migration (Priority: P2)

**Goal**: Replace all hardcoded purple color values with FraiOS blue equivalents across LESS files, TSX files, and SVG assets.

**Independent Test**: Navigate all pages (sign-in, sidebar, explore, models, settings). No purple elements visible. All interactive colors are blue.

### Implementation for User Story 2

#### Hardcoded hex values in LESS files (#470d69 → #3f6587)

- [x] T012 [P] [US2] Replace `#470d69` with `#3f6587` in `src/components/ModelsSidebar/index.module.less`
- [x] T013 [P] [US2] Replace `#470d69` with `#3f6587` in `src/components/CodeEditor/index.module.less`
- [x] T014 [P] [US2] Replace `#470d69` with `#3f6587` in `src/components/AlertForm/index.module.less`
- [x] T015 [P] [US2] Replace `#470d69` with `#3f6587` in `src/components/PageHeader/index.module.less`
- [x] T016 [P] [US2] Replace `#470d69` with `#3f6587` in `src/components/RestAPI/index.module.less`
- [x] T017 [P] [US2] Replace `#470d69` with `#3f6587` in `src/components/ReportForm/index.module.less`
- [x] T018 [P] [US2] Replace `#470d69` with `#3f6587` in `src/components/DataSourcesMenu/index.module.less`
- [x] T019 [P] [US2] Replace `#470d69` with `#3f6587` in `src/components/VersionsList/index.module.less`

#### Secondary purple (#a31bcb → #4a7faa) and rgba variants in LESS files

- [x] T020 [P] [US2] Replace `#a31bcb` and `rgba(163, 27, 203, *)` variants with `#4a7faa` and `rgba(74, 127, 170, *)` in `src/components/ModelsSidebar/index.module.less`
- [x] T021 [P] [US2] Replace `rgba(163, 27, 203, *)` with `rgba(74, 127, 170, *)` in `src/components/Sidebar/index.module.less`
- [x] T022 [P] [US2] Replace purple rgba variants with blue equivalents in `src/components/ExploreCubes/index.module.less`
- [x] T023 [P] [US2] Replace `rgba(163, 27, 203, *)` with `rgba(74, 127, 170, *)` in `src/components/ExploreCubesCategoryItem/index.module.less`
- [x] T024 [P] [US2] Replace purple colors in `src/components/ExploreDataSection/index.module.less`
- [x] T025 [P] [US2] Replace `rgba(71, 13, 105, 0.1)` with `rgba(63, 101, 135, 0.1)` in `src/components/Navbar/index.module.less`
- [x] T026 [P] [US2] Replace purple colors in `src/components/SidebarMenu/index.module.less` (gradient with `rgba(71, 13, 105, 0.1)`)
- [x] T027 [P] [US2] Replace purple rgba variants in `src/components/SignInForm/index.module.less` (`rgba(163, 27, 203, 0.1)` → `rgba(74, 127, 170, 0.1)`)
- [x] T028 [P] [US2] Replace purple rgba variants in `src/components/SignUpForm/index.module.less` (`rgba(163, 27, 203, 0.1)` → `rgba(74, 127, 170, 0.1)`)
- [x] T029 [P] [US2] Replace `#a31bcb` and `rgba(163, 27, 203, *)` and `rgba(71, 13, 105, *)` in `src/components/ReportForm/index.module.less`
- [x] T030 [P] [US2] Replace `rgba(163, 27, 203, 0.1)` in `src/components/LogoutSessions/index.module.less`
- [x] T031 [P] [US2] Replace purple colors in `src/components/ExploreSegmentsSection/index.module.less`
- [x] T032 [P] [US2] Replace purple colors in `src/components/ExploreCubesCategoryItemFilter/index.module.less`
- [x] T033 [P] [US2] Replace purple colors in `src/components/DataSourceSetup/index.module.less`
- [x] T034 [P] [US2] Replace purple colors in `src/components/DataModelGeneration/index.module.less`
- [x] T035 [P] [US2] Replace `#a31bcb` and `rgba(163, 27, 203, *)` and `rgba(71, 13, 105, *)` in `src/components/CodeEditor/index.module.less`
- [x] T036 [P] [US2] Replace `rgba(163, 27, 203, *)` in `src/components/BranchSelection/index.module.less`
- [x] T037 [P] [US2] Replace `#a31bcb` and `rgba(163, 27, 203, *)` in `src/components/AlertForm/index.module.less`
- [x] T038 [P] [US2] Replace purple colors in `src/components/VirtualTable/index.module.less`
- [x] T039 [P] [US2] Replace purple colors in `src/pages/Members/index.module.less`
- [x] T040 [P] [US2] Replace `#a31bcb` in `src/components/Input/index.module.less`
- [x] T041 [P] [US2] Replace `#a31bcb` in `src/components/RequestInfo/index.module.less`
- [x] T042 [P] [US2] Replace `#a31bcb` in `src/components/ExploreFiltersSection/index.module.less`
- [x] T043 [P] [US2] Replace purple colors in `src/components/QueryFilters/index.module.less`
- [x] T044 [P] [US2] Replace purple colors in `src/components/SQLRunner/index.module.less`
- [x] T045 [P] [US2] Replace purple colors in `src/components/FormTile/index.module.less`
- [x] T046 [P] [US2] Replace purple colors in `src/components/StepFormHeader/index.module.less`
- [x] T047 [P] [US2] Replace purple colors in `src/components/ApiSetup/index.module.less`
- [x] T048 [P] [US2] Replace purple colors in `src/pages/Callback/index.module.less`
- [x] T049 [P] [US2] Replace purple colors in `src/pages/ExportModels/index.module.less`
- [x] T050 [P] [US2] Replace purple colors in `src/pages/Logout/index.module.less`

#### Hardcoded colors in TypeScript/React files

- [x] T051 [P] [US2] Update chart colors in `src/utils/constants/colors.ts`: replace `#470D6999` with `#3f658799`, `#A31BCB80` with `#4a7faa80`, `#892C6C99` with `#4a6f8999`
- [x] T052 [P] [US2] Update avatar colors in `src/pages/Teams/index.tsx`: replace `#470D69` with `#3f6587`, `#A31BCB` with `#4a7faa`, and Tag `color="#EDE7F0"` with `"#E0EAF0"`
- [x] T053 [P] [US2] Update avatar colors in `src/components/TeamsTable/index.tsx`: same replacements as T052
- [x] T054 [P] [US2] Update `color="#A31BCB"` to `"#4a7faa"` in `src/components/VersionPreview/index.tsx`
- [x] T055 [P] [US2] Update `starColor="#A31BCB"` to `"#4a7faa"` in `src/components/AlertForm/index.tsx`
- [x] T056 [P] [US2] Update `starColor="#A31BCB"` to `"#4a7faa"` in `src/components/ReportForm/index.tsx`
- [x] T057 [P] [US2] Update color values in `src/components/NestedTag/index.stories.tsx`: replace purple hex values with blue equivalents

#### SVG asset color updates

- [x] T058 [US2] Batch-replace `#470D69` with `#3f6587` and `#A31BCB` with `#4a7faa` across all SVG files in `src/assets/` (~33 files). Use find-and-replace across the directory. Verify each SVG still renders correctly.

**Checkpoint**: All purple eliminated. Color system fully migrated to FraiOS blue.

---

## Phase 5: User Story 3 - Typography Update (Priority: P3)

**Goal**: Replace Manrope with Lato (headings) and Inter (body text) throughout the application.

**Independent Test**: Inspect rendered text on sign-in, models, explore, and settings pages. Headings use Lato, body text uses Inter. No Manrope references in CSS.

### Implementation for User Story 3

- [x] T059 [US3] Update `src/components/SideMenu/index.module.less`: replace `var(--font-manrope)` with `var(--font-inter)` (or `var(--font-lato)` for heading-like text)
- [x] T060 [US3] Search for any remaining `Manrope` or `--font-manrope` references in all `*.less`, `*.tsx`, and `*.ts` files under `src/` and replace with appropriate FraiOS font variable. Run `grep -ri "manrope" src/` to verify zero results after completion.

**Checkpoint**: Typography fully migrated. Lato for headings, Inter for body.

---

## Phase 6: User Story 4 - Glass Morphism Design Language (Priority: P4)

**Goal**: Apply glass morphism styling (backdrop-blur, semi-transparent backgrounds, subtle borders) to header, sidebar, and right sidebar.

**Independent Test**: Navigate authenticated pages. Header has frosted glass appearance. Sidebar has glass-tinted blue background with blur. Right sidebar (models, settings) has glass effect.

### Implementation for User Story 4

- [x] T061 [P] [US4] Apply glass morphism to header in `src/components/Header/index.module.less`: change `.header` background from `var(--color-white)` to `rgba(255, 255, 255, 0.6)`, add `backdrop-filter: blur(12px)`, add `border-bottom: 1px solid rgba(255, 255, 255, 0.2)`. Update `.headerBordered` border to use glass-style border.
- [x] T062 [P] [US4] Apply glass morphism to sidebar in `src/components/SideMenu/index.module.less`: update `.menu` background from `var(--color-primary)` to a semi-transparent brand blue (e.g., `rgba(63, 101, 135, 0.85)`), add `backdrop-filter: blur(12px)`, add subtle `border-right: 1px solid rgba(255, 255, 255, 0.1)`. Update `.wrapper` background from `#f9f9f9` to `rgba(249, 249, 249, 0.6)`.
- [x] T063 [P] [US4] Apply glass morphism to right sidebar in `src/components/Sidebar/index.module.less`: update `.wrapper` background from `#f9f9f9` to `rgba(255, 255, 255, 0.5)`, add `backdrop-filter: blur(10px)`, update border to `1px solid rgba(255, 255, 255, 0.2)`. Update `.body` background similarly. Update `.resizeHandle` hover color from `rgba(163, 27, 203, 0.3)` to `rgba(63, 101, 135, 0.3)`.

**Checkpoint**: Glass morphism applied to all three primary layout surfaces.

---

## Phase 7: User Story 5 - External Reference Cleanup (Priority: P5)

**Goal**: Remove all remaining user-facing "Synmetrix" text references. Update documentation links. Clean up mocks and README.

**Independent Test**: Run `grep -ri "synmetrix" src/ --include="*.tsx" --include="*.ts" --include="*.less"` — zero results except intentionally retained backend URLs. No user-facing Synmetrix text visible.

### Implementation for User Story 5

- [x] T064 [P] [US5] Update `src/components/Navbar/index.tsx`: change docs link `href` from `"https://docs.synmetrix.org"` to appropriate FraiOS docs URL (or remove the docs button if no FraiOS docs URL exists yet — replace with placeholder)
- [x] T065 [P] [US5] Update `src/utils/constants/links.ts`: replace `docs.synmetrix.org` URLs with FraiOS equivalents (or placeholder URLs)
- [x] T066 [P] [US5] Update `src/components/Footer/index.tsx`: replace commented-out Synmetrix copyright and email with FraiOS equivalents
- [x] T067 [P] [US5] Update `src/mocks/members.ts`: replace `@synmetrix*.com` mock emails with `@fraios.com` equivalents
- [x] T068 [P] [US5] Update `src/mocks/request.ts`: replace `/Synmetrixjs/` path with appropriate FraiOS path
- [x] T069 [P] [US5] Update `README.md`: replace all Synmetrix references with FraiOS Semantic Layer branding, update logo image reference
- [x] T070 [US5] Run final `grep -ri "synmetrix" src/` to verify zero user-facing references remain. Document any intentionally retained references (nginx.conf, CI/CD) in a comment at top of this tasks file.

**Checkpoint**: All user-facing Synmetrix references eliminated.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Build validation and final verification.

- [x] T071 Run `bun run lint` and fix any lint errors introduced by changes
- [x] T072 Run `bun run build` and verify production build succeeds with zero errors
- [x] T073 Run `bun run storybook` and verify all existing stories render correctly with new branding
- [x] T074 Visual smoke test: manually navigate sign-in, sidebar, explore, models, settings, signals pages to verify cohesive FraiOS branding (logos, colors, fonts, glass effects)
- [x] T075 Update `.specify/memory/constitution.md` title from "Synmetrix Client Constitution" to "FraiOS Semantic Layer Constitution"

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — add font links first
- **Foundational (Phase 2)**: Depends on Phase 1 — CSS variables and theme tokens BLOCK all user stories
- **US1 (Phase 3)**: Depends on Phase 2 — logo/identity changes
- **US2 (Phase 4)**: Depends on Phase 2 — color migration (can run in parallel with US1)
- **US3 (Phase 5)**: Depends on Phase 2 — typography (can run in parallel with US1/US2)
- **US4 (Phase 6)**: Depends on Phase 2 + US2 color changes — glass morphism uses new colors
- **US5 (Phase 7)**: No dependencies on other stories — text cleanup is independent
- **Polish (Phase 8)**: Depends on ALL user stories being complete

### User Story Dependencies

- **US1 (P1)**: After Phase 2 — independent of other stories
- **US2 (P2)**: After Phase 2 — independent (can parallel with US1, US3, US5)
- **US3 (P3)**: After Phase 2 — independent (can parallel with US1, US2, US5)
- **US4 (P4)**: After Phase 2 + US2 — needs color values finalized first
- **US5 (P5)**: After Phase 2 — independent (can parallel with all others)

### Within Each User Story

- US1: T005-T008 are parallel (different lines in same file), T009-T011 sequential
- US2: T012-T057 are ALL parallel (different files). T058 (SVG batch) last.
- US3: T059-T060 sequential (T060 is verification sweep)
- US4: T061-T063 are ALL parallel (different files)
- US5: T064-T069 are ALL parallel (different files). T070 is verification sweep.

### Parallel Opportunities

- **After Phase 2**: US1, US2, US3, and US5 can ALL start simultaneously
- **Within US2**: All 47 file-level color replacement tasks (T012-T057) run in parallel
- **Within US4**: All 3 glass morphism tasks (T061-T063) run in parallel
- **Within US5**: All 6 text replacement tasks (T064-T069) run in parallel

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Font setup
2. Complete Phase 2: Token foundation
3. Complete Phase 3: Logo + favicon + OG tags
4. **STOP and VALIDATE**: FraiOS identity visible, build passes
5. Deploy/demo if ready — users see FraiOS branding immediately

### Incremental Delivery

1. Phase 1 + 2 → Foundation ready
2. Add US1 → FraiOS identity visible (MVP!)
3. Add US2 → Purple eliminated, blue throughout
4. Add US3 → Typography matches FraiOS
5. Add US4 → Glass morphism polish
6. Add US5 → Text cleanup complete
7. Phase 8 → Final validation

### Parallel Execution (Recommended)

After Phase 2 completes:
- **Stream A**: US1 (identity) → US4 (glass morphism)
- **Stream B**: US2 (colors — largest task set) → verification
- **Stream C**: US3 (typography) + US5 (text cleanup)

Then Phase 8 for final validation.

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Infrastructure files (`nginx.conf`, `.github/workflows/`) intentionally excluded — backend service names are not user-facing
- SVG batch replacement (T058) can use a script or sed command for efficiency
- After US2, run `grep -ri "#470d69\|#470D69\|#a31bcb\|#A31BCB" src/` to verify zero remaining purple
