import en from '@/i18n/strings/en/numberFormat'
import zhCN from '@/i18n/strings/zh-CN/numberFormat'
import jaJP from '@/i18n/strings/ja-JP/numberFormat'
import type { Locale } from 'vue-i18n'

const numberFormats: Record<Locale, Record<string, Intl.NumberFormatOptions>> = {
  en,
  'zh-CN': zhCN,
  'ja-JP': jaJP,
}
export default numberFormats
