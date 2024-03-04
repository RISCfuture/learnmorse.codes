import { createI18n } from 'vue-i18n'

import messages from '@/i18n/strings/messages'
import numberFormats from '@/i18n/strings/numberFormats'

export default createI18n({
  locale: navigator.language,
  fallbackLocale: 'en',
  silentFallbackWarn: true,
  legacy: false,
  messages,
  numberFormats
})
