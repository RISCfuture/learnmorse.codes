import './config/bugsnag'

import Vue from 'vue'
import App from './App.vue'
import store from './store'
import i18n from './i18n'

import 'scroll-behavior-polyfill'

import './config/filters'
import './config/css'

import 'normalize.css/normalize.css'
import '@/assets/styles/font-faces.scss'
import '@/assets/styles/global.scss'
import '@/assets/styles/transitions.scss'

Vue.config.productionTip = false

new Vue({
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
