// https://nuxt.com/docs/api/configuration/nuxt-config

import tailwindcss from '@tailwindcss/vite'
import prodRuntimeConfig from './config'
import devRuntimeConfig from './config.dev'

const config = process.env.NODE_ENV === "production" ?
  prodRuntimeConfig : devRuntimeConfig;

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

  devServer: {
    port: devRuntimeConfig.port
  },

  runtimeConfig: {
    public: {
      serviceName: config.serviceName,

      frontendHost: config.frontendHost,
      backendHost: config.backendHost,
    }
  },

  srcDir: "./src",

  vite: {
    plugins: [
      tailwindcss(),
    ]
  },

  modules: ['@nuxt/fonts', '@nuxt/icon']
})