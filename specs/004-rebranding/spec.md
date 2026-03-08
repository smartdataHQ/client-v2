# Feature Specification: FraiOS Semantic Layer Rebranding

**Feature Branch**: `004-rebranding`
**Created**: 2026-03-07
**Status**: Draft
**Input**: User description: "Rebranding"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visual Identity Replacement (Priority: P1)

A user navigates to the application and sees consistent FraiOS Semantic
Layer branding throughout: the sidebar logo, header logo, browser tab
favicon, page titles, and Open Graph metadata all reflect the new
"FraiOS Semantic Layer" identity instead of Synmetrix branding.

**Why this priority**: Brand identity is the most visible and
foundational aspect of rebranding. Every user interaction begins with
visual identity. Without this, no other rebranding work is meaningful.

**Independent Test**: Can be fully tested by loading the application
and visually confirming that all logo placements, favicon, browser tab
title, and Open Graph tags display FraiOS Semantic Layer branding with
the pinwheel icon. No Synmetrix logos, text, or references remain
visible.

**Acceptance Scenarios**:

1. **Given** a user loads the sign-in page, **When** the page renders,
   **Then** the header displays the FraiOS logo (light theme variant)
   instead of the Synmetrix logo with text.
2. **Given** a user is authenticated, **When** they view the sidebar,
   **Then** the sidebar displays the FraiOS pinwheel icon instead of
   the Synmetrix `logo_bg.png`.
3. **Given** a user views the browser tab, **When** the page loads,
   **Then** the favicon is the FraiOS pinwheel icon and the page title
   reads "FraiOS Semantic Layer" instead of "Synmetrix".
4. **Given** a link to the application is shared, **When** it is
   previewed (e.g., in Slack or social media), **Then** the Open Graph
   image, title, and description reflect FraiOS Semantic Layer
   branding.

---

### User Story 2 - Color System Migration (Priority: P2)

A user navigates the application and experiences the FraiOS color
palette throughout. The primary purple (`#470D69`) is replaced with the
FraiOS brand blue (`#3f6587`). Accent colors, hover states,
backgrounds, and component theming all align with the FraiOS design
language.

**Why this priority**: Color is the next most impactful visual change
after logos. It affects every interactive element and defines the
overall aesthetic feel. Must be done comprehensively to avoid a
patchwork appearance.

**Independent Test**: Can be tested by navigating through all major
pages (sign-in, sidebar, explore, models, settings) and confirming
that no purple-themed elements remain; all interactive and decorative
color usage reflects the FraiOS blue palette.

**Acceptance Scenarios**:

1. **Given** a user views the sidebar, **When** it renders, **Then**
   the background uses FraiOS brand blue instead of Synmetrix purple.
2. **Given** a user interacts with buttons, links, and form controls,
   **When** they hover or click, **Then** the active/hover states use
   FraiOS blue tones instead of purple tones.
3. **Given** the Ant Design theme configuration, **When** the
   application renders any themed component, **Then** the primary
   color token reflects FraiOS brand blue.
4. **Given** a user views any page, **When** they inspect CSS custom
   properties, **Then** `--color-primary` and related variables use
   FraiOS values.

---

### User Story 3 - Typography Update (Priority: P3)

A user reads text throughout the application and encounters the FraiOS
typeface system (Lato for headings, Inter for body text) instead of
Manrope.

**Why this priority**: Typography reinforces brand identity but is
less immediately noticeable than logos or colors. It creates a cohesive
feel when combined with the other visual changes.

**Independent Test**: Can be tested by inspecting rendered text on
sign-in, dashboard, settings, and models pages to confirm Lato and
Inter are applied and Manrope references are removed.

**Acceptance Scenarios**:

1. **Given** a user views any page, **When** text renders, **Then**
   headings use Lato and body text uses Inter.
2. **Given** the application CSS, **When** font-family declarations
   are inspected, **Then** no references to Manrope remain.
3. **Given** the Ant Design theme configuration, **When** the
   fontFamily token is inspected, **Then** it specifies the FraiOS
   font stack.

---

### User Story 4 - Glass Morphism Design Language (Priority: P4)

A user experiences the FraiOS glass morphism aesthetic on key layout
surfaces: the header, sidebar, and card containers feature
semi-transparent backgrounds with backdrop blur, subtle borders, and
soft shadows consistent with FraiOS visual design.

**Why this priority**: Glass morphism is a signature FraiOS design
element that distinguishes it from the flat Synmetrix aesthetic. It
adds visual polish but is cosmetic rather than functional, making it
lower priority than identity and color changes.

**Independent Test**: Can be tested by navigating through the
application and confirming that the header, sidebar, and primary card
containers exhibit glass-like transparency, backdrop blur effects, and
subtle border styling.

**Acceptance Scenarios**:

1. **Given** a user views the header, **When** it renders, **Then** it
   has a semi-transparent background with backdrop-blur.
2. **Given** a user views the sidebar, **When** it renders, **Then**
   it exhibits glass morphism styling with subtle transparency.
3. **Given** a user views card-like containers (e.g., settings panels,
   exploration cards), **When** they render, **Then** they use glass
   card styling with semi-transparent backgrounds and soft shadows.

---

### User Story 5 - External Reference Cleanup (Priority: P5)

A user encounters no residual Synmetrix branding in any text content:
documentation links, footer text, placeholder strings, alt text, ARIA
labels, and error messages all reference "FraiOS Semantic Layer"
where appropriate or use generic phrasing.

**Why this priority**: Text references are the least visible branding
element but create inconsistency if left unchanged. This is cleanup
work that follows the primary visual rebranding.

**Independent Test**: Can be tested by searching the codebase for
any remaining "Synmetrix" or "synmetrix" string references and
confirming they are either replaced or intentionally retained (e.g.,
in backend API URLs that are not part of user-facing branding).

**Acceptance Scenarios**:

1. **Given** the application codebase, **When** searching for
   "Synmetrix" (case-insensitive) in user-facing strings, **Then** no
   results are found except where referencing external backend URLs.
2. **Given** a user views the Docs button in the navbar, **When** they
   inspect its link, **Then** it points to FraiOS documentation (or is
   updated/removed as appropriate).
3. **Given** a user views any error message, empty state, or
   placeholder, **When** it renders, **Then** it does not reference
   Synmetrix.

---

### Edge Cases

- What happens when dark mode is introduced? FraiOS logos have both
  light and dark theme variants; the application must serve the correct
  variant based on theme context. For P1, use the light-theme variant
  as the current application has no dark mode. Dark mode logo switching
  is deferred to a future dark-mode feature.
- What happens with cached assets? Users with cached Synmetrix favicons
  or OG images may see stale branding until browser cache expires. This
  is acceptable and no cache-busting mechanism is required beyond
  standard asset hashing by Vite.
- What happens with i18n translation files? Both English and Russian
  translation files must be updated to replace any "Synmetrix"
  references with "FraiOS Semantic Layer".

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Application MUST display the FraiOS pinwheel icon as the
  favicon in the browser tab.
- **FR-002**: Application MUST display "FraiOS Semantic Layer" as the
  page title in the browser tab.
- **FR-003**: Sidebar MUST display the FraiOS pinwheel icon (from
  `public/FraioS-icon-lighttheme.svg`) as the collapsed/primary logo.
- **FR-004**: Header MUST display the FraiOS full logo (from
  `public/FraioS-logo-lighttheme.svg`) where the Synmetrix logo
  with text previously appeared.
- **FR-005**: Open Graph meta tags MUST use FraiOS branding (title:
  "FraiOS Semantic Layer", image: FraiOS app icon, description
  referencing FraiOS Semantic Layer).
- **FR-006**: Primary color throughout the application MUST change
  from `#470D69` (purple) to FraiOS brand blue (`#3f6587`).
- **FR-007**: All CSS custom properties referencing Synmetrix purple
  palette MUST be updated to FraiOS blue palette equivalents.
- **FR-008**: Ant Design ConfigProvider theme token `colorPrimary`
  MUST be set to FraiOS brand blue.
- **FR-009**: Typography MUST change from Manrope to Lato (headings)
  and Inter (body), matching FraiOS font system.
- **FR-010**: Key layout surfaces (header, sidebar) MUST adopt glass
  morphism styling (semi-transparent backgrounds, backdrop-blur).
- **FR-011**: All user-facing strings referencing "Synmetrix" MUST be
  replaced with "FraiOS Semantic Layer" or appropriate alternatives.
- **FR-012**: i18n translation files (English, Russian) MUST be
  updated to reflect new branding.
- **FR-013**: Storybook stories MUST render correctly with new
  branding and color tokens.

### Key Entities

- **Brand Assets**: Logo files (icon and full logo, light/dark
  variants), favicon, Open Graph image.
- **Color Tokens**: CSS custom properties and Ant Design theme tokens
  that define the application's color palette.
- **Typography Tokens**: Font family declarations in CSS and Ant
  Design theme configuration.
- **Layout Surfaces**: Header, sidebar, cards, and panels that receive
  glass morphism treatment.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Zero visible instances of Synmetrix branding (logo, name,
  or purple color) remain in the user interface across all pages.
- **SC-002**: All logo placements display the correct FraiOS asset
  (pinwheel icon or full logo) at appropriate sizes without distortion.
- **SC-003**: Color palette consistency: no purple (`#470D69` or
  related shades) appears in any rendered component; all primary color
  usage reflects FraiOS blue.
- **SC-004**: Typography renders consistently with the FraiOS font
  stack on all pages.
- **SC-005**: Glass morphism is visible on header and sidebar surfaces
  with functional backdrop-blur effects.
- **SC-006**: Storybook renders all existing stories without visual
  regression beyond intended rebranding changes.
- **SC-007**: Production build succeeds without errors after all
  branding changes are applied.
- **SC-008**: All i18n translations updated: searching for "Synmetrix"
  in translation JSON files returns zero user-facing results.

### Assumptions

- The current application has no dark mode; light-theme logo variants
  are used exclusively. Dark mode support will be a separate feature.
- External URLs (e.g., backend API endpoints containing "synmetrix")
  are not part of user-facing branding and are out of scope.
- The FraiOS brand assets in the `public/` folder are final and
  approved for production use.
- Glass morphism treatment is limited to header, sidebar, and
  card-level containers. Full glass morphism across all components is
  deferred to the broader FraiOS migration.
- Font files for Lato and Inter will be loaded via Google Fonts or
  bundled; the method is an implementation decision.
