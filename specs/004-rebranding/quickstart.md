# Quickstart: FraiOS Semantic Layer Rebranding

**Branch**: `004-rebranding` | **Date**: 2026-03-07

## Prerequisites

- Bun installed (`bun --version`)
- Repository cloned and on `004-rebranding` branch
- FraiOS brand assets present in `public/` folder:
  - `FraioS-icon-lighttheme.svg`
  - `FraioS-icon-darktheme.svg`
  - `FraioS-logo-lighttheme.svg`
  - `FraioS-logo-darktheme.svg`
  - `Frai-OSAppIcon.png`

## Setup

```bash
git checkout 004-rebranding
bun install
```

## Development

```bash
bun run dev
```

Open `http://localhost:8000` to see the application. Verify:

1. **Favicon**: Browser tab shows FraiOS pinwheel icon
2. **Page title**: Tab reads "FraiOS Semantic Layer"
3. **Sidebar**: Blue-tinted glass sidebar with FraiOS icon
4. **Header**: FraiOS full logo displayed
5. **Colors**: No purple elements visible — all blue palette
6. **Typography**: Inter body text, Lato headings

## Validation Checklist

```bash
# Build succeeds
bun run build

# Lint passes
bun run lint

# Tests pass
bun run test

# No remaining Synmetrix references in user-facing code
grep -ri "synmetrix" src/ --include="*.tsx" --include="*.ts" \
  --include="*.less" --include="*.css" | \
  grep -v "node_modules" | grep -v ".spec." | grep -v "mocks/"

# No remaining purple colors
grep -ri "#470d69\|#470D69\|#a31bcb\|#A31BCB" src/ \
  --include="*.less" --include="*.tsx" --include="*.ts"

# Storybook renders
bun run storybook
```

## Key Files Modified

| Category | Files |
|----------|-------|
| HTML/Meta | `index.html` |
| Theme | `src/layouts/RootLayout.tsx` |
| CSS Variables | `src/global.less` |
| Sidebar | `src/components/SideMenu/index.tsx`, `*.module.less` |
| Header | `src/components/Header/index.tsx`, `*.module.less` |
| Navbar | `src/components/Navbar/index.tsx`, `*.module.less` |
| Colors | ~35 `.module.less` files, `src/utils/constants/colors.ts` |
| Text | `src/utils/constants/links.ts`, `package.json` |
