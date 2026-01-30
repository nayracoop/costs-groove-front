# @nyr/nuxt-module

Minimal Nuxt 3 module for the Nyr component library.

## Install
Add as a local module or publish to npm.

```js
// nuxt.config.js (or .ts)
export default defineNuxtConfig({
  modules: [
    // local path
    // path.resolve(__dirname, 'etudes/nyr-module')
    // or published name
    '@nyr/nuxt-module'
  ],
  nyr: {
    theme: {
      // optional overrides of CSS vars, e.g.
      // accent: '#2563EB'
    },
    sse: {
      // baseURL: 'https://example.com/sse'
    },
    preferences: {
      numberRounding: 2
    }
  }
})
```

## Use
- Components auto-registered: e.g., `<NyrCard />`.
- Layouts: `admin` and `account` registered; select with `definePageMeta({ layout: 'admin' })`.
- Composables auto-imported:
  - `useNyr()` → `{ prefs, perms, theme, setPrefs, setTheme }`
  - `useTheme()` → `{ theme, setTheme }`
  - `useSSE(channel)` → `{ data, close }`

## Notes
- Tailwind expected in the consuming app.
- Theming via CSS variables (`--nyr-*`) applied by the client plugin.
- JS-first; types can be added later via `.d.ts`.
