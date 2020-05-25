import Vue from 'vue'
import VueI18n from 'vue-i18n'

import messages from '@/i18n/strings/messages'
import numberFormats from '@/i18n/strings/numberFormats'

Vue.use(VueI18n)

export default new VueI18n({
  locale: navigator.language,
  fallbackLocale: 'en',
  messages,
  numberFormats
})
