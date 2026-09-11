import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa'

// Vendor packages worth isolating from application code: they turn over far more slowly than
// `src/`, so a deploy that only touches the app leaves their chunks cached in visitors' browsers.
// `vue-i18n` is matched ahead of the Vue runtime because the trailing slash is all that separates
// the two, and `pinia` shares the runtime's chunk because rolldown merges the two either way.
//
// `@sentry/*` is deliberately absent: naming a chunk for it would pull the session-replay and
// browser-tracing modules that `@/config/sentryIntegrations` defers back onto the critical path,
// which costs far more than the caching it would buy.
const vendorChunks: [chunk: string, modules: RegExp][] = [
  ['vue-i18n', /node_modules\/(vue-i18n|@intlify)\//],
  ['vue', /node_modules\/(vue|@vue|pinia)\//],
]

/**
 * Assigns a vendor module to its own chunk, leaving everything else to default chunking.
 */
function vendorChunk(moduleID: string): string | undefined {
  return vendorChunks.find(([, modules]) => modules.test(moduleID))?.[0]
}

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  const plugins = [
    vue(),
    command === 'serve' && vueDevTools({ launchEditor: process.env.VITE_LAUNCH_EDITOR }),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: false,
      injectRegister: false,
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,webmanifest,woff2}'],
        // This site has no client-side router, so an unknown path is a real 404.
        // vite-plugin-pwa otherwise defaults this to index.html, which makes the
        // service worker answer every unknown path with the home page.
        navigateFallback: undefined,
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
      },
    }),
  ].filter(Boolean)

  return {
    plugins,
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    build: {
      sourcemap: 'hidden',
      rollupOptions: {
        output: {
          manualChunks: vendorChunk,
        },
      },
    },
  }
})
