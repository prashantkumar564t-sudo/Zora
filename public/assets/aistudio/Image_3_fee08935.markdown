---
name: Cinematic South Indian Streaming Showcase
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#e9bcb6'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#af8782'
  outline-variant: '#5e3f3b'
  surface-tint: '#ffb4aa'
  primary: '#ffb4aa'
  on-primary: '#690003'
  primary-container: '#e50914'
  on-primary-container: '#fff7f6'
  inverse-primary: '#c0000c'
  secondary: '#c6c6c7'
  on-secondary: '#2f3131'
  secondary-container: '#454747'
  on-secondary-container: '#b4b5b5'
  tertiary: '#c7c6c6'
  on-tertiary: '#2f3131'
  tertiary-container: '#727272'
  on-tertiary-container: '#f9f8f8'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdad5'
  primary-fixed-dim: '#ffb4aa'
  on-primary-fixed: '#410001'
  on-primary-fixed-variant: '#930007'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c7'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#454747'
  tertiary-fixed: '#e3e2e2'
  tertiary-fixed-dim: '#c7c6c6'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#464747'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-hero:
    fontFamily: Plus Jakarta Sans
    fontSize: 56px
    fontWeight: '800'
    lineHeight: 64px
    letterSpacing: -0.03em
  display-hero-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 30px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.015em
  title-sm:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
    letterSpacing: -0.01em
  body-md:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0em
  label-badge:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.04em
  label-metadata:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.25rem
  gutter-mobile: 0.75rem
  margin: 3.5rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

The brand personality is cinematic, authoritative, and deeply immersive. Designed specifically for prestige South Indian storytelling, the interface steps back to allow vibrant cinematic visuals, dynamic poster art, and rich video hero units to command total visual authority. 

The target audience spans global cinema enthusiasts, regional film connoisseurs, and contemporary viewers seeking premium multilingual streaming experiences across Tamil, Telugu, Malayalam, and Kannada cinema. The emotional response must evoke the grandeur of a darkened premiere theater: composed, focused, silent, and deliberate.

The design movement is **Minimalist Cinematic Dark**. It rejects noisy borders, decorative blurs, neon halos, and SaaS-like panel fragmentation. Structural hierarchy is achieved purely through layered surface values, generous negative space, dynamic focal points, and razor-sharp typographic discipline.

## Colors

The palette revolves around deep charcoal foundations and restrained accents:

- **Base Canvas (`#141414`)**: Deep charcoal ground avoiding absolute black to preserve contrast fidelity and reduce eye fatigue.
- **Surface Elevation 1 (`#1F1F1F`)**: Resting state for media cards, bottom navigation, and top bars.
- **Surface Elevation 2 (`#282828`)**: Hovered cards, flyout menus, and active modal overlays.
- **Primary Red (`#E50914`)**: Strictly reserved for primary playback indicators, progress rails, live broadcast tags, and critical subscription CTA buttons. Must never be used as general ambient lighting or ornamental borders.
- **Typography Primary (`#FFFFFF`)**: Pure crisp white for titles, main CTAs, and active navigation nodes.
- **Typography Secondary / Metadata (`#A3A3A3`)**: Muted slate for release years, CBFC ratings, runtime metrics, audio channels, and director credits.

## Typography

Typography prioritizes cinematic legibility and editorial rhythm. 

- **Display & Section Titles**: Set in **Plus Jakarta Sans** with negative tracking (`-0.015em` to `-0.03em`) to mimic film titling and high-end cinematic editorial layouts.
- **Narrative & Body**: Set in **Inter** for neutral, utilitarian clarity across synopsis copy, cast listings, and UI dialogue.
- **Metadata & Badges**: Small-caps or tight medium-weight **Inter** (`label-badge`, `label-metadata`) ensures high scanability against dark media tiles for HDR badges, audio formats (Dolby Atmos, 5.1), and censor certifications (U/A, A).

## Layout & Spacing

The layout is built around a horizontal content-rail philosophy using a responsive fluid grid.

- **Desktop (>=1280px)**: 12-column layout with `3.5rem` outer canvas margins. Rails support dynamic edge bleed where horizontal carousels align to the left margin guide and scroll fluidly past the right screen boundary.
- **Tablet (768px - 1279px)**: 8-column layout with `2rem` margins and `1rem` gutters.
- **Mobile (<768px)**: 4-column layout with `1rem` margins and `0.75rem` card gutters, prioritizing 2-column or 3-column portrait media posters.
- **Vertical Spacing Rhythm**: Billboard hero modules transition seamlessly into content rails with a 40% vertical gradient scrim. Carousels are spaced consistently using `space-xl` (`2.5rem`) to maintain clear category distinctions without artificial divider lines.

## Elevation & Depth

Visual hierarchy is constructed purely through tonal stratification and dark scrims rather than physical shadows:

- **Surface Tiers**:
  - **Level 0 (Canvas)**: `#141414` backdrop.
  - **Level 1 (Resting Tiles)**: `#1F1F1F` cards and metadata containers.
  - **Level 2 (Active / Hover States)**: `#282828` expanded video previews and flyout menus.
- **Cinematic Scrims**: Linear gradients transitioning from `rgba(20, 20, 20, 0)` to `#141414` ensure video poster artwork blends organically into the dark canvas.
- **Shadows**: Omit traditional drop shadows on resting elements. On active hover expansion, a subtle neutral shadow (`0 12px 32px rgba(0, 0, 0, 0.75)`) separates the card from the underlying rail. Glows and saturated colored drop shadows are strictly prohibited.

## Shapes

The design system employs **Soft (`1`)** corner treatments to maintain a professional, architectural aesthetic:

- **Media Cards & Thumbnails**: Standardized to `0.25rem` (4px). Avoid heavy rounded corners that crop essential cinema poster artwork or widescreen framing.
- **Action Buttons & Badges**: Standard buttons maintain `0.25rem` radius; utility tags, language selector chips, and video quality badges (4K UHD, HDR10) utilize `0.25rem` for geometric precision.
- **Pill Exceptions**: Language switcher pills and secondary circular play/info icons may use full circular radius when strictly serving circular interaction targets.

## Components

### Media Cards
- **Aspect Ratios**: 2:3 vertical posters for curated theatrical releases; 16:9 landscape cards for ongoing web series and episodes.
- **Resting State**: Flush surface `#1F1F1F`, roundedness of `0.25rem`, no borders.
- **Hover/Focus State**: Smooth scale transformation (1.05x), elevated to `#282828` with subtle dark ambient shadow. Hover state reveals quick metadata (runtime, audio, age rating) and inline action triggers.

### Playback & Progress Indicators
- **Scrubber / Progress Bar**: Track background set to `rgba(255, 255, 255, 0.2)`. Filled elapsed duration set to `#E50914`. Buffer indicator rendered in `rgba(255, 255, 255, 0.4)`. Height is 3px resting, expanding to 6px on scrub interaction.

### Action Buttons
- **Primary CTA ("Watch Now" / "Play")**: Solid `#FFFFFF` fill with `#141414` text and iconography. Clean, high contrast, immediate hierarchy.
- **Secondary CTA ("Add to Watchlist" / "Trailer")**: Translucent background (`rgba(255, 255, 255, 0.15)`) with `#FFFFFF` text. Transitions to `rgba(255, 255, 255, 0.25)` on hover.
- **Subscription / Critical Action**: Solid crimson `#E50914` with `#FFFFFF` text, reserved exclusively for conversion checkpoints.

### Badges & Quality Indicators
- **Certification & Format Tags**: `#1F1F1F` background, `1px` subtle outline in `rgba(255, 255, 255, 0.15)`, text in `#A3A3A3` using `label-badge`.
- **Live / Exclusive Badges**: Solid `#E50914` background with `#FFFFFF` bold uppercase text.

### Filter & Language Chips
- Horizontal scrolling row of regional filters (Tamil, Telugu, Malayalam, Kannada).
- Resting state: `#1F1F1F` background with `#A3A3A3` text.
- Active state: `#FFFFFF` text with subtle white bottom indicator or solid `#282828` elevation with `#FFFFFF` text.

### Inputs & Search
- Borderless search bar on `#1F1F1F` background. Placeholder text set to `#A3A3A3`. Active search displays instant visual cards in a fluid dropdown modal layered over `#141414` at 90% opacity.