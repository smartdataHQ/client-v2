# Research: FraiOS Semantic Layer Rebranding

**Branch**: `004-rebranding` | **Date**: 2026-03-07

## R1: Synmetrix Branding Touchpoints

### Decision
All Synmetrix branding references must be replaced across 6 categories
of touchpoints identified in the codebase.

### Findings

**Category 1: HTML & Meta Tags** (`index.html`)
- Lines 8, 12, 15, 17, 20, 22, 29-31: page title, description,
  og:title, og:description, twitter:title, twitter:description
- Favicon reference: `logo.png`
- OG image reference: `og.png`

**Category 2: Logo Image References**
- `src/components/SideMenu/index.tsx` — imports `/logo_bg.png`
- `src/components/Header/index.tsx` — imports `logo_with_text.png`
- `README.md:1` — logo image reference

**Category 3: Text Strings**
- `package.json:2` — `"name": "synmetrix-client"`
- `src/components/Navbar/index.tsx:65` — `href="https://docs.synmetrix.org"`
- `src/components/Footer/index.tsx:28,37` — copyright + email (commented out)
- `src/utils/constants/links.ts:2,4` — docs.synmetrix.org URLs
- `src/mocks/members.ts` — 6 mock email addresses `@synmetrix*.com`
- `src/mocks/request.ts:3` — mock path `/Synmetrixjs/datasources/v1/load`
- `README.md` — ~17 instances throughout

**Category 4: Infrastructure (out of scope for user-facing rebranding)**
- `nginx.conf` — 4 proxy_pass references to `synmetrix-*` service names
- `.github/workflows/build-and-release.yml:58` — Docker image tag
- These are backend service names, NOT user-facing

**Category 5: i18n**
- No "Synmetrix" strings found in translation JSON files (translations
  use generic keys). No changes needed.

**Category 6: Constitution/Specs**
- `.specify/memory/constitution.md:29` — title references Synmetrix

### Alternatives Considered
- Partial rebrand (logos only): Rejected — leaves inconsistent text
  references that confuse users.
- Automated find-replace: Risky — must preserve backend service names
  in nginx.conf and Docker configs.

---

## R2: Color System Scope

### Decision
Replace all purple color values with FraiOS blue equivalents. Use CSS
custom properties as the primary mechanism; fix hardcoded values in
component files.

### Findings

**Central Definitions (2 locations):**
1. `src/global.less:123-124` — `--color-primary: #470d69`,
   `--color-mediumpurple: #a56edd`
2. `src/layouts/RootLayout.tsx:19` — Ant Design `colorPrimary: "#470D69"`

**CSS Variable Consumers (21 `.module.less` files):**
These files use `var(--color-primary)` and will automatically update
when the variable changes: Navbar, SideMenu, Button, Card, Avatar,
SignInForm, SignUpForm, SearchInput, LanguageToggler, LogoutSessions,
DataSourceSelection, DataSourceSetup, DataSourceCard,
DataModelGeneration, DataModelSelection, StepFormHeader, ApiSetup,
AccessCard, ExploreCubes, VirtualTable, Members page.

**Hardcoded Purple Values (8 `.module.less` files):**
Files with `#470d69` hardcoded instead of using the CSS variable:
ModelsSidebar, CodeEditor, AlertForm, PageHeader, RestAPI, ReportForm,
DataSourcesMenu, VersionsList.

**Additional Purple Colors (#a31bcb and rgba variants):**
~24 additional `.module.less` files use `#a31bcb`,
`rgba(163, 27, 203, *)`, or `rgba(71, 13, 105, *)` variants.

**TypeScript/React hardcoded colors:**
- `src/utils/constants/colors.ts` — chart colors with `#470D6999`,
  `#A31BCB80`, `#892C6C99`
- `src/components/TeamsTable/index.tsx:26` — avatar colors array
  `["#000000", "#470D69", "#A31BCB"]`
- `src/pages/Teams/index.tsx:44` — duplicate avatar colors array
- `src/components/VersionPreview/index.tsx:50` — `color="#A31BCB"` Badge
- `src/components/AlertForm/index.tsx:202,241` — `starColor="#A31BCB"`
- `src/components/ReportForm/index.tsx:110,152` — `starColor="#A31BCB"`
- `src/components/NestedTag/index.stories.tsx` — story examples
- `src/pages/Teams/index.tsx:94` — Tag `color="#EDE7F0"` (light purple)
- `src/components/TeamsTable/index.tsx:45` — Tag `color="#EDE7F0"`

**SVG assets with hardcoded purple (33 files in `src/assets/`):**
SVG icons containing `#470D69` or `#A31BCB`: alert-close, alert,
branch-colored, console-close, copy, csv, docs, eye, js-file, mail,
member-boolean through member-time (9 files), report, save, send,
table, webhook, yml-file, access-full, access-no, access-partial,
and others.

**Other CSS variables needing review:**
- `--color-dimgray-100: #463854` (has purple tint)
- `--color-whitesmoke: #e9e8ee` (has purple tint)
- `--color-darkorchid: #b65cf8` (bright purple)
- `--color-dimgray-200/300` (rgba variants of purple-tinted gray)

### Color Mapping

| Synmetrix (Current) | FraiOS (Target) | Usage |
|---------------------|-----------------|-------|
| `#470d69` (primary purple) | `#3f6587` (brand blue) | Primary brand |
| `#a56edd` (medium purple) | `#5a8ab5` (medium blue) | Accent/secondary |
| `#a31bcb` (bright purple) | `#4a7faa` (bright blue) | Highlights |
| `#b65cf8` (dark orchid) | `#6ba3d6` (light blue) | Decorative |
| `rgba(71,13,105,*)` | `rgba(63,101,135,*)` | Transparent overlays |
| `rgba(163,27,203,*)` | `rgba(74,127,170,*)` | Transparent accents |
| `#463854` (dimgray) | `#3a4f63` (slate gray) | Dark text/borders |
| `#e9e8ee` (whitesmoke) | `#e8edf2` (cool gray) | Light backgrounds |

### Alternatives Considered
- CSS-only variable swap: Would miss ~35 LESS files with hardcoded
  values, ~10 TSX files, and ~33 SVG assets.
- Full Tailwind migration: Out of scope — constitution allows LESS for
  existing code, Tailwind only for new code.
- SVG color via CSS currentColor: Would require refactoring SVG imports
  to use `currentColor` instead of hardcoded fills. Viable but higher
  effort. Direct hex replacement is simpler for this scope.

---

## R3: Typography Migration

### Decision
Replace Manrope with Lato (headings) and Inter (body text) to match
FraiOS font system. Load via Google Fonts CDN.

### Findings

**Font declarations:**
- `src/global.less` — `@font-face` declarations for Manrope
  (Regular, Medium, SemiBold, Bold, ExtraBold) from `/fonts/` directory
- `src/global.less` — `--font-manrope: "Manrope"` CSS variable
- `src/layouts/RootLayout.tsx:18` — Ant Design `fontFamily: "Manrope"`

**Font references in components:**
- `src/components/SideMenu/index.module.less:52` — `var(--font-manrope)`
- Multiple components inherit via Ant Design theme or CSS cascade

### Alternatives Considered
- Self-hosted fonts: Viable but adds build complexity. Google Fonts CDN
  is simpler and consistent with FraiOS pattern.
- Keep Manrope: Rejected — typography is a key brand identifier.

---

## R4: Glass Morphism Surfaces

### Decision
Apply glass morphism to header, sidebar, and right sidebar. Use
backdrop-blur with semi-transparent backgrounds matching FraiOS
`glass-panel.ts` patterns.

### Findings

**Surfaces for glass treatment:**

1. **Header** (`src/components/Header/index.module.less`)
   - Currently: `background: var(--color-white)`, solid white
   - Target: Semi-transparent with backdrop-blur

2. **SideMenu** (`src/components/SideMenu/index.module.less`)
   - Currently: `.menu { background: var(--color-primary) }` solid purple
   - Target: Glass-tinted with brand blue and backdrop-blur
   - Already has glass-like button states: `rgba(255,255,255,0.02/0.1)`

3. **Right Sidebar** (`src/components/Sidebar/index.module.less`)
   - Currently: `background: #f9f9f9`, solid light gray
   - Target: Semi-transparent with backdrop-blur
   - Resize handle uses `rgba(163, 27, 203, 0.3)` — needs color update

4. **Sidebar wrapper** — `background: #f9f9f9` in both SideMenu and
   Sidebar components

**Existing glass morphism already in codebase:**
- `src/components/SignInForm/index.module.less:64` —
  `.magicLink { backdrop-filter: blur(10px); background: rgba(163, 27, 203, 0.1) }`
- `src/components/SignUpForm/index.module.less:19` —
  `.magicLink { backdrop-filter: blur(10px); background: rgba(163, 27, 203, 0.1) }`
- These need color updates (purple → blue) but the pattern is already
  established in the codebase.

**FraiOS glass-panel.ts reference patterns:**
- Standard: `rgba(255,255,255,0.6)` bg, `blur(12px)`, white 20% border
- Container: `rgba(255,255,255,0.4)` bg, `blur(8px)`, white 15% border
- Card: `rgba(255,255,255,0.5)` bg, `blur(10px)`, white 20% border
- Dark: `rgba(0,14,74,0.3)` bg, `blur(16px)`, white 5% border

### Alternatives Considered
- Full glass morphism on all cards/panels: Deferred per spec assumptions.
  Limited to layout-level surfaces for this feature.
- No glass morphism: Rejected — it's a signature FraiOS design element.

---

## R5: Asset Inventory

### Decision
Use existing FraiOS brand assets from `public/` folder. Create new
OG image from app icon.

### Findings

**Available FraiOS assets:**
- `public/FraioS-icon-lighttheme.svg` — 258x258 pinwheel icon
- `public/FraioS-icon-darktheme.svg` — 258x258 pinwheel icon
- `public/FraioS-logo-lighttheme.svg` — Full logo with text
- `public/FraioS-logo-darktheme.svg` — Full logo with text (white)
- `public/Frai-OSAppIcon.png` — Dark app icon (for OG image)

**Synmetrix assets to replace:**
- `public/logo.png` — favicon (replace with FraiOS icon)
- `public/logo_bg.png` — sidebar logo (replace with FraiOS icon SVG)
- `public/logo_with_text.png` — header logo (replace with FraiOS logo SVG)
- `public/og.png` — Open Graph image (replace with Frai-OSAppIcon.png)

### Alternatives Considered
- Generate new OG image: Could be done later. Using Frai-OSAppIcon.png
  is sufficient for initial rebrand.
