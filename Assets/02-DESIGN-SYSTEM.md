# La Ecoferia — Sistema de Diseño "Patagonian Artisanal Organic"

**Versión:** 1.0 · **Fuente:** DESIGN.md, code__5_.html (tokens), styles.png, maquetas HTML

---

## 1. Principios

- Estética orgánica, artesanal y cálida inspirada en mercados de montaña patagónicos.
- Texturas de papel kraft y ruido sutil (`feTurbulence` SVG, opacidad 0.03–0.05) sobre superficies.
- Bordes "de papel": `1px solid #DCC7A1` (paper-border).
- Microinteracciones táctiles: `active:scale-95` en botones, transiciones 200–300ms.
- Material Symbols Outlined como set de iconografía.

## 2. Tokens de Color (Material 3 adaptado)

### 2.1 Marca

| Token | Hex | Uso |
|---|---|---|
| `primary` | `#506049` | Verde bosque — botones principales, títulos |
| `on-primary` | `#ffffff` | Texto sobre primary |
| `primary-container` | `#697960` | Contenedores destacados |
| `on-primary-container` | `#f8ffef` | Texto sobre primary-container |
| `primary-fixed` | `#d6e8ca` | Chips/badges suaves |
| `primary-fixed-dim` | `#baccaf` | Variante tenue / inverse-primary |
| `secondary` | `#8e4d31` | Terracota — acentos cálidos |
| `on-secondary` | `#ffffff` | Texto sobre secondary |
| `secondary-container` | `#feaa88` | Contenedor terracota |
| `secondary-fixed` | `#ffdbce` | Chip terracota suave |
| `tertiary` | `#7a5500` | Dorado — precios, CTA de compra |
| `tertiary-container` | `#9a6c00` | Botón CTA (comprar/pagar) |
| `on-tertiary-container` | `#fffbff` | Texto sobre CTA |
| `tertiary-fixed` | `#ffdeaa` | Badge dorado suave |
| `tertiary-fixed-dim` | `#fabc45` | Acentos (estrellas, alertas suaves) |
| `brand-accent` | `#DCC7A1` | Madera clara — bordes de papel, divisores |

### 2.2 Superficies

| Token | Hex |
|---|---|
| `background` / `surface` / `surface-bright` | `#fbf9f4` |
| `surface-dim` | `#dbdad5` |
| `surface-container-lowest` | `#ffffff` |
| `surface-container-low` | `#f5f3ee` |
| `surface-container` | `#f0eee9` |
| `surface-container-high` | `#eae8e3` |
| `surface-container-highest` / `surface-variant` | `#e4e2dd` |
| `on-surface` / `on-background` | `#1b1c19` |
| `on-surface-variant` | `#444841` |
| `inverse-surface` | `#30312e` |
| `inverse-on-surface` | `#f2f1ec` |
| `outline` | `#757870` |
| `outline-variant` | `#c4c8be` |
| `surface-tint` | `#53634b` |

### 2.3 Estados de error

| Token | Hex |
|---|---|
| `error` | `#ba1a1a` |
| `on-error` | `#ffffff` |
| `error-container` | `#ffdad6` |
| `on-error-container` | `#93000a` |

## 3. Tipografía

**Familias:** Playfair Display (600/700) para display/headline · Inter (400/600/700) para cuerpo, títulos de componente y labels.

| Rol | Fuente | Tamaño / Interlineado | Peso | Extra |
|---|---|---|---|---|
| `display-lg` | Playfair Display | 48px / 56px | 700 | letter-spacing -0.02em |
| `display-lg-mobile` | Playfair Display | 32px / 40px | 700 | — |
| `headline-md` | Playfair Display | 24px / 32px | 600 | — |
| `title-lg` | Inter | 20px / 28px | 600 | — |
| `body-md` | Inter | 16px / 24px | 400 | — |
| `body-sm` | Inter | 14px / 20px | 400 | — |
| `label-caps` | Inter | 12px / 16px | 700 | letter-spacing 0.05em, UPPERCASE |

## 4. Espaciado y Layout

| Token | Valor |
|---|---|
| `unit` / `xs` | 4px |
| `sm` | 8px |
| `gutter` | 12px |
| `md` | 16px |
| `container-margin` | 20px |
| `lg` | 24px |
| `xl` | 40px |
| Ancho máximo contenedor | 1280px |

**Border radius:** `DEFAULT` 0.25rem · `lg` 0.5rem · `xl` 0.75rem · `full` 9999px (chips, avatares, botones pill).

## 5. Componentes Base (inventario de las maquetas)

| Componente | Descripción / patrón |
|---|---|
| **TopAppBar** | Sticky, `bg-surface`, borde inferior `outline-variant`, logo en `headline-md` |
| **BottomNavBar** (mobile) | Fija, 4 ítems (Mercado, Agenda, Blog, Perfil), rounded-t-xl, oculta en md+ |
| **Chips de filtro** | Pill, activo `bg-primary text-on-primary`, inactivo `bg-surface-container` + borde |
| **Card de producto** | paper-border, imagen 1:1, nombre `title-lg`, precio en `tertiary`, botón add_shopping_cart circular |
| **Card de marca** | Logo circular, sellos de impacto como chips, botones Seguir / Mensaje |
| **Tabs** | Borde inferior 2px `primary` en activo (Productos / Nosotros / Contacto) |
| **Stepper de checkout** | 3 pasos con círculos conectados por línea `#DCC7A1` |
| **Inputs "paper"** | Fondo `surface-variant/30`, solo borde inferior `brand-accent`, focus `primary` |
| **Botón CTA compra** | `bg-tertiary-container text-on-tertiary-container`, pill o rounded-md |
| **Sellos de impacto** | Chips: Orgánico, Local, Fair Trade, Zero Waste |
| **Noise/kraft overlay** | SVG fractalNoise, opacidad 3–5%, pointer-events none |

## 6. Mapeo a Tailwind v4

En Tailwind v4 los tokens se declaran con `@theme` en CSS (no en `tailwind.config`):

```css
@import "tailwindcss";

@theme {
  --color-primary: #506049;
  --color-on-primary: #ffffff;
  --color-secondary: #8e4d31;
  --color-tertiary-container: #9a6c00;
  --color-surface: #fbf9f4;
  --color-surface-container: #f0eee9;
  --color-on-surface: #1b1c19;
  --color-on-surface-variant: #444841;
  --color-outline-variant: #c4c8be;
  --color-brand-accent: #DCC7A1;
  /* ...resto de tokens de la sección 2 */

  --font-display: "Playfair Display", serif;
  --font-body: "Inter", sans-serif;

  --spacing-gutter: 12px;
  --spacing-container-margin: 20px;
}
```

> Las maquetas usan CDN de Tailwind v3 con `tailwind.config`; al migrar a Vite + Tailwind v4 se trasladan los tokens al bloque `@theme` y se eliminan los duplicados.

## 7. Assets

| Archivo | Contenido |
|---|---|
| `Logo.png` | Logo: ilustración monolineal de hoja/helecho patagónico en verde bosque sobre blanco hueso |
| `styles.png` | Guía visual de estilos (paleta + tipografía) |
| `screen*.png` | Capturas de las maquetas (home, directorio, perfil de marca, checkout, ingreso, panel admin) |
| `Feed1-4.png` | Referencias de comunicación de marca para redes |
| `code__*.html` | Maquetas HTML navegables (fuente de verdad del markup) |
