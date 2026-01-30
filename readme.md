This is a proptotype with a lot of AI generated stuff. It lacks imagination as you might see


4 projects are mixed here
- component lib
- a showcase of components
- a bunch of pages examples
- a page builder

As it grows the component lib must be indepentent


# Nyr Component Library — Functional Decisions

This document captures the initial functional design for the Nyr component library to be easily plugged into Nuxt (Vue 3) projects with Tailwind CSS, minimal dependencies, and JS-first implementation.

## Recent Updates: Enhanced Styling (Jan 2026)

The component library has been updated with professional, modern styling inspired by contemporary business applications. Key improvements include:

### Design System
- **Color Palette**: olive (#6e634a), cream (#f4ecdd), charcoal (#21241e), sage (#b1bca2), stone (#9d9ea2), cocoa (#402210)
- **Typography**: Inter font family for clean, professional appearance
- **Spacing**: Refined padding and margins for optimal visual hierarchy
- **Shadows**: Subtle elevation with layered shadows for depth

### Component Enhancements

#### Cards (NyrCard)
- White background with subtle shadows
- Refined border styling with hover states
- Border transitions on hover
- Theme variants: `default`, `info`, `accent`, `muted`
- Improved focus states for accessibility

#### Buttons (NyrButton)
- Multiple variants: `primary`, `secondary`, `outline`, `ghost`
- Size options: `sm`, `md`, `lg`
- Enhanced hover and active states
- Disabled state styling
- Smooth transitions and micro-interactions

#### Form Inputs (NyrInput)
- Clean, modern input styling with rounded corners
- Enhanced focus states with ring effects
- Size variants: `sm`, `md`, `lg`
- State variants: `error`, `success`
- Placeholder styling
- Hover and disabled states

#### Typography (NyrText)
- Refined heading hierarchy with proper line heights
- Letter spacing adjustments for readability
- Weight and size variations
- Utility classes for common text styles

### Additional Features
- Table styling classes (`.nyr-table`)
- Badge/Tag components (`.nyr-badge`) with variants
- Layout helpers (`.nyr-container`, `.nyr-section`, `.nyr-divider`)
- Custom scrollbar styling
- Utility spacing classes

## Goals
- Keep minimal: avoid unnecessary JS libraries; prefer plain Vue/Nuxt features.
- Ship a Nuxt 3 module that auto-registers components and exposes a small plugin + composables.
- Use Tailwind CSS for layout/spacing/width utilities; use CSS variables for theming.
- JS-first (no heavy TypeScript at start). Add types later as optional.

## Architecture
- Library shape: Nuxt 3 module (JavaScript) that:
  - Auto-registers all `Nyr*` components.
  - Registers a lightweight client plugin (`nyr.client.js`) to provide theme, preferences, permissions, and SSE helpers.
  - Exposes composables: `useNyr()`, `useTheme()`, `usePrefs()`, `useSSE(channel)`.
- Distribution: publishable as an npm package or local module. Consumers add it to `nuxt.config` under `modules` and configure `nyr` options.
- No external state library; use Vue reactivity and Nuxt runtime config/state.

### Module Options (nuxt.config)
```js
// nuxt.config.ts or nuxt.config.js
export default defineNuxtConfig({
  modules: [
    // 'nyr-module' or local path
    // '@your-scope/nyr'
  ],
  nyr: {
    theme: {
      // optional overrides of CSS variables (see Theming)
      // e.g. accent: '#6e634a'
    },
    sse: {
      // baseURL: 'https://example.com/sse' // optional
    },
    preferences: {
      // optional defaults (merged with server/browser)
      numberRounding: 2
    }
  }
})
```

## Tailwind + Theming
- Tailwind: use stock utilities for layout/spacing/width (`grid`, `col-span-*`, `w-*`, responsive prefixes `sm: md: lg: xl:`).
- Theming: CSS variables drive colors; components read variables via Tailwind `var()` usage or inline styles. A component-level `theme` prop selects one of `default|info|success|warning|error` accents.

### CSS Variable Tokens
These variables exist at `:root` and can be overridden by a `[data-nyr-theme="..."]` or via the module plugin using inline style on `html`.

- Base: `--nyr-bg`, `--nyr-fg`, `--nyr-surface`, `--nyr-border`, `--nyr-muted`, `--nyr-accent`
- Accents: `--nyr-info`, `--nyr-success`, `--nyr-warning`, `--nyr-error`

Default values (olive/cream palette):
- `--nyr-bg`: `#f4ecdd`
- `--nyr-fg`: `#21241e`
- `--nyr-surface`: `#ffffff`
- `--nyr-border`: `#9d9ea2`
- `--nyr-muted`: `#6e634a`
- `--nyr-accent`: `#402210`
- `--nyr-info`: `#6e634a`
- `--nyr-success`: `#b1bca2`
- `--nyr-warning`: `#9d9ea2`
- `--nyr-error`: `#402210`

Accounting app baseline:
- Keep neutral, readable tones; surface cards on `--nyr-surface` with subtle borders; accent on actionable elements.

### Using Tailwind with CSS Variables
Example (inside components or global CSS):
```css
:root {
  --nyr-bg: #ffffff;
  --nyr-fg: #111827;
  --nyr-surface: #f3f4f6;
  --nyr-border: #e5e7eb;
  --nyr-muted: #6b7280;
  --nyr-accent: #2563eb;
  --nyr-info: #0ea5e9;
  --nyr-success: #16a34a;
  --nyr-warning: #d97706;
  --nyr-error: #dc2626;
}

/* Optional theme variants */
[data-nyr-theme="info"] { --nyr-accent: var(--nyr-info); }
[data-nyr-theme="success"] { --nyr-accent: var(--nyr-success); }
[data-nyr-theme="warning"] { --nyr-accent: var(--nyr-warning); }
[data-nyr-theme="error"] { --nyr-accent: var(--nyr-error); }
```
Use in Tailwind (e.g., `text-[color:var(--nyr-fg)] bg-[color:var(--nyr-surface)] border-[color:var(--nyr-border)]`).

## Width/Responsive Classes
Use Tailwind directly to keep minimal:
- Grid: `grid grid-cols-12 gap-4`
- Spans: `col-span-12 md:col-span-6 lg:col-span-4`
- Flex basis: `basis-full md:basis-1/2 lg:basis-1/3`
- Widths: `w-full sm:w-1/2 lg:w-1/3`

If desired, we can add small aliases in the library (optional, later): `nyr-col-{1..12}` mapping to `col-span-*` for consistency.

## Components
All components:
- **No inline styles**: use global `.nyr-*` classes instead (defined in `nyr-module/runtime/assets/css/nyr.css`)
- Use CSS variables for colors, fonts, spacing via `.nyr-*` classes
- `theme` prop to override (`default|info|success|warning|error`)
- Accessible: keyboard navigable (Tab), focus shows subtle shadow
- `hint` slot/prop renders auxiliary info under element
- Accept standard Vue events; consumers attach callbacks via listeners (e.g., `@blur`, `@focus`, `@keyup`, `@click`)

### Component Classes
All Nyr components use a set of global CSS classes that leverage CSS variables. These are applied automatically and prevent flashing on page load:

- `.nyr-card` — Card container (white surface, stone border, subtle shadow)
- `.nyr-card-hint` — Hint text under card (muted color)
- `.nyr-button` — Button (accent background, white text, hover/focus states)
- `.nyr-button-hint` — Hint text inside button
- `.nyr-input-container` — Input wrapper (flex column, gap)
- `.nyr-input-label` — Input label (foreground color)
- `.nyr-input-field` — Input element (white background, stone border)
- `.nyr-input-hint` — Input hint text (muted, italic)
- `.nyr-text` — Base text class
- `.nyr-h1`, `.nyr-h2`, `.nyr-h3`, `.nyr-h4`, `.nyr-h5`, `.nyr-h6` — Heading sizes
- `.nyr-p` — Paragraph text
- `.nyr-number` — Number display
- `.nyr-icon` — Icon wrapper
- `.nyr-pad` — Padded container

**Why classes instead of inline styles?**
- Prevents color flashing on load (CSS vars applied synchronously by plugin before render)
- Cleaner component code
- Easier to override in global CSS if needed
- Better CSS cascading and maintainability

### NyrCard
- Purpose: container; width via Tailwind classes on the component instance.
- Props: 
  - `theme?: 'default'|'info'|'success'|'warning'|'error'`
- Slots: default (children), optional `footer`
- Classes: `.nyr-card`, `.nyr-card-hint`

### NyrText
- Purpose: render text with type/prefix/postfix and formatting.
- Props:
  - `type: 'h1'|'h2'|'h3'|'h4'|'h5'|'h6'|'p'|'number'|'icon'|'pad'`
  - `prefix?: string`
  - `postfix?: string`
  - For `number`: respects preferences (rounding) from `usePrefs()`
  - For `pad`: left-pad value based on preferences
- Classes: `.nyr-text`, `.nyr-h1`...`.nyr-h6`, `.nyr-p`, `.nyr-number`, `.nyr-icon`, `.nyr-pad`

### NyrInput
- Purpose: controlled input (text, number) with optional formatter; renders a label + input + hint container.
- Props:
  - `label?: string`
  - `type: 'text'|'number'`
  - `modelValue?: string|number`
  - `formatter?: string|function(value, { prefs, perms }): string`
  - `hint?: string`
- Emits: `update:modelValue`, `blur`, `focus`, `keydown`, `keyup`
- Classes: `.nyr-input-container`, `.nyr-input-label`, `.nyr-input-field`, `.nyr-input-hint`
- Notes: when `formatter` is a function, library passes preferences and permissions from `useNyr()`. Use `formatter="number"` to respect rounding preferences.

### NyrButton
- Purpose: action trigger with optional redirect.
- Props:
  - `redirect?: string` (navigates after `click` unless handler returns `false` or rejects)
- Emits: `click`
- Classes: `.nyr-button`, `.nyr-button-hint`
- Behavior: emit `click`; if handler returns `false` (sync) or resolves to `false` (async), skip redirect; otherwise navigate.

## Layouts
- Export `NyrAdminLayout` and `NyrAccountLayout`. Initially identical; diverge later.
- In Nuxt pages, choose layout with `definePageMeta({ layout: 'admin' })` or use as wrappers.

## Data, Preferences, SSE
- Plugin (`nyr.client.js`) provides a small context:
  - `useNyr()`: returns `{ prefs, perms, setPrefs }` (prefs merged from server + localStorage).
  - `useTheme()`: reactive theme name and setter. Can set `data-nyr-theme` on `html` or inline style for CSS vars.
  - `useSSE(channel)`: creates/returns a reactive source using `EventSource` (browser) with optional `baseURL` from config.
- Server + browser merge:
  - Server can inject initial `prefs` via payload; plugin merges with localStorage and exposes reactive `prefs`.

## Testing
- Unit/component tests: Vitest + Vue Test Utils
  - Render each component, assert props, theme class/vars, emits on events, accessibility (tab focus).
- E2E (optional): Playwright for layouts/navigation and keyboard flows.
- No extra libs beyond common Vue testing stack.

## Why Nuxt Module + Plugin/Composables (JS-first)
- Nuxt Module: distribution shell that auto-registers all components and a plugin, so projects just add the module and use components anywhere. This minimizes setup and ensures consistent injection of theme/prefs/SSE helpers.
- Plugin: a single `nyr.client.js` file that runs on client, merges preferences, exposes helpers, and sets CSS variables. This keeps runtime logic centralized and minimal.
- Composables: tiny functions (`useNyr`, `useTheme`, `useSSE`) that components and app code can call. They encapsulate state and avoid extra libraries.
- TypeScript is optional: start with JS; if/when desired, ship `.d.ts` typings later without changing runtime.

## Minimal Implementation Phases
1) Scaffold module + auto-registration + plugin shell.
2) Implement `NyrCard`, `NyrText`, `NyrInput`, `NyrButton` with basic props/events.
3) Wire theming via CSS variables; ensure Tailwind classes pass-through.
4) Add `useSSE` composable (client-only) and preferences merge.
5) Add tests (Vitest + VTU) for each component and layout.
6) Add layouts and docs examples.
