import VueI18n from 'vue-i18n'
import lesson from './lesson'
import website from './website'
import completed from './completed'

import LocaleMessages = VueI18n.LocaleMessages;

const en: LocaleMessages = {
  completed,
  lesson,
  website
}
export default en
