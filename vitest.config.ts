import { fileURLToPath } from 'node:url'
import { configDefaults, defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default defineConfig(async (env) => {
  const resolvedViteConfig = typeof viteConfig === 'function' ? await viteConfig(env) : viteConfig
  return mergeConfig(
    resolvedViteConfig,
    defineConfig({
      test: {
        environment: 'jsdom',
        exclude: [...configDefaults.exclude, 'e2e/*', 'tests/e2e/**'],
        root: fileURLToPath(new URL('./', import.meta.url)),
        setupFiles: ['./tests/unit/setup.ts'],
      },
    }),
  )
})
