# Internationalization (i18n) guidelines

This app uses vue-i18n (v11, composition mode, `legacy: false`). Read this
before adding, editing, or translating any user-facing string. The base locale
is `en`, with `zh-CN` and `ja-JP` additionally supported.

## Adding or changing a string

1. Edit `strings/en/<namespace>.ts` first — `en` is canonical.
2. Mirror the exact same key in every locale dir (`zh-CN/`, `ja-JP/`).

Never leave a key present in `en` but missing in another locale — vue-i18n will
silently fall back to English and leak an untranslated string.

## Translation rules

- **Emoji** entries (`💯💯💯`, `✨✨✨`) stay as-is.
- **Numbers** are formatted with `n(value, 'integer' | 'percent')`; the option
  objects in each `numberFormat.ts` apply locale rules automatically.

## Technical jargon

Keep technical terms in English unless an established native translation
exists. When unsure, search sites/forums in the target locale (amateur-radio /
CW communities) and use what real speakers say. Established choices already in
use:

- "Morse code" → 摩尔斯电码 (zh) / モールス信号 (ja; モールス符号 for an individual code character).
- "dots and dashes" → 点和划 (zh) / 短点・長点 (ja).
- "symbol" (a learned per-letter sound) → 字符 (zh) / 符号 (ja).

## What is NOT translated

- **The lesson plan / Koch symbol ordering** (`src/data/**`) — it is data, never
  alter it for localization.
- **Static SEO/crawler metadata** in `index.html` (OG, Twitter, JSON-LD) and the
  PWA `public/site.webmanifest` — intentionally left English. This is a
  client-rendered SPA; per-locale manifests/OG aren't worth the plumbing.
- The `<noscript>` fallback in `index.html` — JS is off, so runtime i18n can't
  reach it.

## Locale selection & lazy loading

`locales.ts` is the single source of truth for which locales exist: the
supported-locale list, the `isSupportedLocale` type guard,
`matchLocale`/`detectLocale` (stored choice under `localStorage` key `locale`,
else the best match for `navigator.languages`, else `en`), and
`localeOptions()`, which derives the switcher's autonym labels from
`Intl.DisplayNames` (with deliberate overrides: 中文（简体） for `zh-CN` since
the site supports Simplified Chinese specifically, and 日本語 for `ja-JP` to
drop the pointless region qualifier).

Only the `en` catalog is bundled eagerly (it is the fallback); `zh-CN` and
`ja-JP` messages are code-split and loaded on demand. ALL locale switching goes
through the async `setLocale()` in `index.ts` — it awaits the catalog chunk
before switching (so the UI never flashes English), persists the choice, and
refreshes document metadata via `metadata.ts`. `main.ts` awaits `initLocale()`
before mounting so the first paint is already localized. The floating
`components/LocaleSwitcher.vue` calls `useLocale().setLocale()`, a guarding
wrapper around the same entry point.

## Validation

For new/longer translations, also spot-check mobile layouts (≤700px is the
`small` breakpoint) for overflow — Chrome DevTools MCP or Playwright. Watch the
text-dense screens (Start, Abandoned, Completed, Result) and the switcher menu.
