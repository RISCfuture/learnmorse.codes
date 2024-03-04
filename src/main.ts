import bugsnagVue from '@/config/bugsnag'

import 'scroll-behavior-polyfill'
import './config/css'
import 'normalize.css/normalize.css'
import '@/assets/styles/font-faces.scss'
import '@/assets/styles/global.scss'
import '@/assets/styles/transitions.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import i18n from '@/i18n'
import App from './App.vue'

const app = createApp(App)

app.use(createPinia())
app.use(i18n)
if (bugsnagVue) app.use(bugsnagVue)

app.config.globalProperties.$filters = {
  symbol(char: string) {
    return char === ' ' ? ' ' : char
  }
}

app.mount('#app')
