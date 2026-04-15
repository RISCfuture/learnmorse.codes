import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(async ({ command }) => {
  const plugins = [vue(), vueDevTools({ launchEditor: 'rubymine' })]

  if (command === 'build') {
    try {
      const { default: csp } = await import('vite-plugin-csp-guard')
      plugins.push(
        csp({
          dev: { run: false },
          build: { sri: false },
          policy: {
            'default-src': ["'self'"],
            'script-src': ["'self'"],
            'style-src': ["'self'"],
            'style-src-attr': ["'unsafe-inline'"],
            'img-src': ["'self'", 'data:', 'blob:'],
            'font-src': ["'self'"],
            'connect-src': ["'self'", 'https://*.ingest.sentry.io', 'https://*.sentry.io'],
            'worker-src': ["'self'", 'blob:'],
            'child-src': ["'self'", 'blob:'],
            'object-src': ["'none'"],
            'base-uri': ["'self'"],
            'form-action': ["'self'"],
          },
        }),
      )
    } catch {
      // CSP plugin is ESM-only; tools like knip that inspect this config via
      // CJS require under Yarn PnP fail to resolve it. Skip silently; the real
      // Vite build loads it fine through native ESM.
    }
  }

  return {
    plugins,
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    build: {
      sourcemap: true,
    },
  }
})
