# Copilot Instructions for Nayra Sistemita

# General Guidelines
- Follow linting setup allways
- Avoid inline styles; use Tailwind CSS classes exclusively
- Use components for basic UI elements if they exists. If they dont exists give advice

## Vue & Nuxt Standards
- Use Vue 3 Composition API with `<script setup>` syntax always
- Use `definePageMeta({layout: "admin"})` for layout declarations
- Import composables from `../../nyr-module/runtime/composables/`
- Follow Nuxt 3 conventions for routes and pages

## Component Usage
- Use custom Nyr components exclusively: `NyrButton`, `NyrInput`, `NyrModal`, `NyrTable`, `NyrIcon`, `NyrCard`, `NyrSelect`, `NyrBadge`, `NyrAvatar`, `NyrText`
- Component naming in templates: lowercase with hyphens (e.g., `action-buttons`, `modal-content`)
- Import composables: `import { useTableCrud } from "../../nyr-module/runtime/composables/useTableCrud";`

## Styling
- Use Tailwind CSS utility classes exclusively
- Color palette: `charcoal` (primary text), `gray-600`, `blue-600`, `green-600`, `orange-500`
- Spacing: Use standard Tailwind scale (p-6, mb-6, gap-3)
- Responsive: Mobile-first approach with `max-w-xs`, `md:`, `lg:` prefixes
- Shadow: Use `shadow-sm` for subtle elevation

## Data Management
- Use `ref()` for reactive state
- Keep form objects as `ref({ field: "" })`
- Use computed properties where appropriate
- Sample/mock data should be clearly marked and easy to swap for API calls

## Composable Patterns
Composables should return:
- State refs
- Computed properties (if needed)
- Handler functions for user actions
- Example pattern from `useTableCrud`:
  ```javascript
  export function useComposable(initialState) {
    const state = ref(initialState);
    const handler = () => { /* logic */ };
    return { state, handler };
  }
  ```

## File Organization
```
pages/
  ├── index.vue
  ├── tablero.vue
  └── [feature].vue

components/
  └── [Feature].vue

composables/
  ├── useTableCrud.js
  └── use[Feature].js
```

## Modal Patterns
- Always use `NyrModal` with `v-model` binding
- Structure: Header (h3 with `text-lg font-semibold`), Content (form fields), Footer (action buttons)
- Button variants: primary for confirm, secondary for cancel

## Table Patterns
- Define headers array with `text` and `class` properties
- Define rows as array of arrays, each cell has `text`, `class`, `editable`, `component`
- Use `#cell-[name]` template slots for custom column rendering
- Include pagination with `:paginate="true"` and `:limit="8"`

## Form Handling
- Use separate `ref()` for form inputs
- Include `resetFormFunction` to clear fields after submission
- Use `onConfirm`, `onCancel` naming convention for modal actions

## Icon Usage
- Use `NyrIcon` component with `icon` prop (e.g., `plus`, `eye`, `copy`, `archive`)
- Icon sizes: `sm`, `md`, `lg`
- Use `class="mr-2"` to add spacing after inline icons

## Code Style
- Use semicolons
- Use kebab-case for CSS classes and component bindings
- Use camelCase for JavaScript variables and functions
- Keep components focused and reusable
- Add comments for complex logic
- Use destructuring for imports and props

## Testing Considerations
- Components should be easily testable
- Keep logic in composables separate from UI logic
- Use descriptive variable and function names
