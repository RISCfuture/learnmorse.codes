import { addIntegration, browserTracingIntegration, replayIntegration } from '@sentry/vue'

/**
 * Registers the browser-tracing and session-replay integrations with the running Sentry client.
 *
 * Both integrations carry the bulk of the Sentry payload — around 170 kB raw, most of it rrweb —
 * while only a sampled fraction of sessions is ever traced or replayed. Keeping them in this
 * module puts them in their own chunk, which `main.ts` imports once the app has mounted so they
 * never delay the first paint.
 */
export function addDeferredIntegrations(): void {
  addIntegration(browserTracingIntegration())
  addIntegration(replayIntegration({ maskAllText: true, blockAllMedia: true }))
}
