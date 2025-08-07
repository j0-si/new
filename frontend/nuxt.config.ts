// https://nuxt.com/docs/api/configuration/nuxt-config

import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

  css: [
    "~/assets/main.css",
  ],

  fonts: {
    defaults: {
      weights: ['400 700'],
      styles: ['normal', 'italic'],
      subsets: [
        'cyrillic-ext',
        'cyrillic',
        'greek-ext',
        'greek',
        'vietnamese',
        'latin-ext',
        'latin',
      ]
    },
  },

  srcDir: "./src",

  vite: {
    plugins: [
      tailwindcss(),
    ]
  },

  modules: ['@nuxt/fonts']
})