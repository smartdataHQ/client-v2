# Data Model: FraiOS Semantic Layer Rebranding

**Branch**: `004-rebranding` | **Date**: 2026-03-07

This feature involves no data model changes. It is a purely visual/UI
rebranding effort affecting:

- Static assets (logos, favicon, OG image)
- CSS custom properties and color tokens
- Ant Design theme configuration
- Typography declarations
- Glass morphism styling on layout surfaces
- User-facing text strings

No database schema, GraphQL operations, or state management changes
are required.

## Entities Affected (UI Only)

### Brand Assets (Static Files)

| Asset | Current File | Replacement |
|-------|-------------|-------------|
| Favicon | `public/logo.png` | `public/FraioS-icon-lighttheme.svg` |
| Sidebar icon | `public/logo_bg.png` | `public/FraioS-icon-lighttheme.svg` |
| Header logo | `public/logo_with_text.png` | `public/FraioS-logo-lighttheme.svg` |
| OG image | `public/og.png` | `public/Frai-OSAppIcon.png` |

### Color Tokens

| Token | Current Value | New Value |
|-------|--------------|-----------|
| `--color-primary` | `#470d69` | `#3f6587` |
| `--color-mediumpurple` | `#a56edd` | `#5a8ab5` |
| `--color-darkorchid` | `#b65cf8` | `#6ba3d6` |
| `--color-dimgray-100` | `#463854` | `#3a4f63` |
| `--color-dimgray-200` | `rgba(70,56,84,0.2)` | `rgba(58,79,99,0.2)` |
| `--color-dimgray-300` | `rgba(70,56,84,0.1)` | `rgba(58,79,99,0.1)` |
| `--color-whitesmoke` | `#e9e8ee` | `#e8edf2` |
| Ant Design `colorPrimary` | `#470D69` | `#3f6587` |

### Typography Tokens

| Token | Current Value | New Value |
|-------|--------------|-----------|
| `--font-manrope` | `"Manrope"` | `"Inter"` |
| Ant Design `fontFamily` | `"Manrope"` | `"Inter"` |
| Heading font | Manrope | Lato |
| Body font | Manrope | Inter |

### Hardcoded Color Replacements

| Pattern | Replacement | Files Affected |
|---------|-------------|----------------|
| `#470d69` / `#470D69` | `#3f6587` | 8 LESS + 2 TS files |
| `#a31bcb` / `#A31BCB` | `#4a7faa` | ~15 LESS files |
| `rgba(71, 13, 105, *)` | `rgba(63, 101, 135, *)` | ~8 LESS files |
| `rgba(163, 27, 203, *)` | `rgba(74, 127, 170, *)` | ~12 LESS files |
| `#470D6999` | `#3f658799` | 1 TS file (colors.ts) |
| `#A31BCB80` | `#4a7faa80` | 1 TS file (colors.ts) |
| `#892C6C99` | `#4a6f8999` | 1 TS file (colors.ts) |
| `#EDE7F0` (light purple tag) | `#E0EAF0` (light blue tag) | 2 TSX files |
| `#470D69` / `#A31BCB` in SVGs | `#3f6587` / `#4a7faa` | ~33 SVG assets |
| `starColor="#A31BCB"` | `starColor="#4a7faa"` | 2 TSX files (AlertForm, ReportForm) |
| `color="#A31BCB"` (Badge) | `color="#4a7faa"` | 1 TSX file (VersionPreview) |
