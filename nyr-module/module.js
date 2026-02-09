import { defineNuxtModule, addPlugin, createResolver, addImportsDir, addComponentsDir, addLayout } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: '@nyr/nuxt-module',
    configKey: 'nyr'
  },
  defaults: {
    theme: {},
    sse: {},
    preferences: {}
  },
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)
    const runtimeDir = resolve('./runtime')

    // Register client plugin
    addPlugin(resolve(runtimeDir, 'plugin/nyr.client'))

    // Auto-import composables
    addImportsDir(resolve(runtimeDir, 'composables'))

    // Auto-register components
    addComponentsDir({ path: resolve(runtimeDir, 'components') })

    // Register layouts
    addLayout({ src: resolve(runtimeDir, 'layouts/NyrAdminLayout.vue'), name: 'admin' })
    addLayout({ src: resolve(runtimeDir, 'layouts/NyrAccountLayout.vue'), name: 'account' })
    
    // Add global Nyr CSS
    nuxt.options.css = [
      ...(nuxt.options.css || []), 
      resolve(runtimeDir, 'assets/css/nyr.css'),
      resolve(runtimeDir, 'assets/menu-styles.css')
    ]

    // Expose options to public runtime config
    nuxt.options.runtimeConfig.public = nuxt.options.runtimeConfig.public || {}
    nuxt.options.runtimeConfig.public.nyr = { ...options }
  }
})