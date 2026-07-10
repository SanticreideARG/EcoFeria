---
name: Patagonian Artisanal Organic
colors:
  surface: '#fbf9f4'
  surface-dim: '#dbdad5'
  surface-bright: '#fbf9f4'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3ee'
  surface-container: '#f0eee9'
  surface-container-high: '#eae8e3'
  surface-container-highest: '#e4e2dd'
  on-surface: '#1b1c19'
  on-surface-variant: '#444841'
  inverse-surface: '#30312e'
  inverse-on-surface: '#f2f1ec'
  outline: '#757870'
  outline-variant: '#c4c8be'
  surface-tint: '#53634b'
  primary: '#506049'
  on-primary: '#ffffff'
  primary-container: '#697960'
  on-primary-container: '#f8ffef'
  inverse-primary: '#baccaf'
  secondary: '#8e4d31'
  on-secondary: '#ffffff'
  secondary-container: '#feaa88'
  on-secondary-container: '#783c22'
  tertiary: '#7a5500'
  on-tertiary: '#ffffff'
  tertiary-container: '#9a6c00'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d6e8ca'
  primary-fixed-dim: '#baccaf'
  on-primary-fixed: '#111f0d'
  on-primary-fixed-variant: '#3c4b35'
  secondary-fixed: '#ffdbce'
  secondary-fixed-dim: '#ffb598'
  on-secondary-fixed: '#370e00'
  on-secondary-fixed-variant: '#71361d'
  tertiary-fixed: '#ffdeaa'
  tertiary-fixed-dim: '#fabc45'
  on-tertiary-fixed: '#271900'
  on-tertiary-fixed-variant: '#5f4100'
  background: '#fbf9f4'
  on-background: '#1b1c19'
  surface-variant: '#e4e2dd'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-md:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-lg:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  container-margin: 20px
  gutter: 12px
---

## Brand & Style
The design system for this marketplace evokes the rugged yet nurturing spirit of Patagonia. The brand personality is grounded, artisanal, and deeply eco-conscious, moving away from sterile tech aesthetics toward a "Digital Craft" philosophy. It targets conscious consumers who value provenance and sustainability.

The style is a blend of **Minimalism** and **Tactile/Skeuomorphism**. We use heavy whitespace to allow product photography to breathe, but ground the interface with organic textures (subtle grain and paper-like finishes) that suggest physical touch. The goal is to make the user feel as though they are browsing a high-end farmers' market rather than a standard e-commerce platform.

## Colors
The palette is rooted in the natural landscape of the south.
- **Base (Bone White):** Used for all primary backgrounds to provide a warm, gallery-like feel.
- **Primary (Sage):** Used for primary actions, navigation indicators, and success states.
- **Secondary (Terracotta):** Used for highlights, promotional banners, and organic category tags.
- **Accents (Mustard & Wood):** Mustard is reserved for high-impact calls to action or seasonal alerts. Light Wood is utilized for subtle UI section dividers and container backgrounds to break the monotony of the bone white.
- **Text (Forest):** Our "black" is a deep Forest green, ensuring high legibility while maintaining the organic theme. Avoid pure #000000.

## Typography
The system uses a high-contrast typographic pairing to signal both tradition and modern efficiency. 
- **Headlines:** Playfair Display provides an editorial, sophisticated feel. Use this for product names, section headers, and storytelling elements.
- **Body & Interface:** Inter is used for all functional text. It is chosen for its exceptional legibility on mobile screens and its neutral, systematic nature which balances the expressive serif.
- **Hierarchies:** Large displays use a negative letter-spacing for a "tight" editorial look, while small labels use increased tracking (0.05em) for clarity in metadata and tags.

## Layout & Spacing
This is a mobile-first, fluid system designed for PWA deployment. 
- **Grid:** Use a 4-column grid for mobile and a 12-column grid for desktop.
- **Margins:** Generous 20px side margins ensure content does not feel cramped, reflecting the open spaces of Patagonia.
- **Rhythm:** All spacing is based on a 4px baseline. Components should generally use 16px (md) or 24px (lg) padding to maintain an "airy" artisanal feel.
- **Reflow:** On desktop, the content width is capped at 1280px, centered with "dead space" filled by the warm #F9F7F2 background.

## Elevation & Depth
Depth is created through **Tonal Layers** rather than heavy shadows. 
- **Level 0 (Base):** Bone white background.
- **Level 1 (Cards):** Use a 1px solid border in Light Wood (#DCC7A1) or a very subtle, large-radius ambient shadow (4% opacity Forest green).
- **Level 2 (Interactive):** Elements like active buttons or open modals use a slightly stronger shadow with a slight vertical offset (y: 4px) to suggest they are "resting" on the paper surface.
- **Textures:** Apply a 5% opacity "noise" or "kraft paper" overlay to Level 1 containers to enhance the tactile feeling.

## Shapes
The shape language is organic and soft but maintains structural integrity.
- **Standard UI (Buttons, Inputs):** 0.5rem (8px) corners. This strikes a balance between friendly and professional.
- **Large Containers (Cards, Images):** 1rem (16px) corners.
- **Small Elements (Tags, Badges):** Fully rounded (pill-shaped) to distinguish them from interactive buttons.
- **Images:** Always use the `rounded-lg` (1rem) setting to soften the "tech" feel of the photography.

## Components
- **Buttons:** Primary buttons use the Sage (#7D8E74) background with white text. Secondary buttons use a Terracotta (#C67B5C) outline with a 1px weight. Avoid gradients; use solid, flat fills.
- **Chips & Tags:** Used for "Organic," "Local," and "Fair Trade" labels. These should have a Light Wood (#DCC7A1) background with Forest (#3E4A39) text.
- **Cards:** Product cards must feature a full-bleed image at the top with a 1px Light Wood border around the entire container. The price should be highlighted in Terracotta.
- **Input Fields:** Use a subtle background fill of #F2F0EA (slightly darker than the base) and a bottom-only border of 1px in Wood for a minimalist, "form-paper" look.
- **Lists:** Use wide spacing (16px) between items with a very faint Wood-colored horizontal divider.
- **Custom Iconography:** Use monolinear, hand-drawn-style icons with slightly rounded ends to match the artisanal theme.