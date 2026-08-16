/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_E2E_TESTING: string
  readonly VITE_SENTRY_DSN: string
  readonly VITE_SENTRY_RELEASE: string
}
