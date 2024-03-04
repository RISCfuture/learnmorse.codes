import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/*'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      // browser: {
      //   enabled: true,
      //   headless: true,
      //   name: 'chromium',
      //   provider: 'playwright'
      // },
      setupFiles: ['./tests/unit/setup.ts'],
    }
  })
)
