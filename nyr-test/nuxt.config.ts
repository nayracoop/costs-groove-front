import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2025-12-23',
  modules: [
    '@nuxtjs/tailwindcss',
    '@nyr/nuxt-module'
  ],
  css: [
    '~/assets/css/tailwind.css'
  ],
  nyr: {
    theme: {
      accent: '#2563EB'
    },
    preferences: {
      numberRounding: 2,
      padLength: 6,
      padChar: '0'
    },
    sse: {
      // baseURL: 'http://localhost:3001/sse'
    },
    ssr: true,

    nitro: {
      static: true, // Optimiza la salida para hosting estático
    }
  }
})