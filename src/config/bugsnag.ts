import Vue from 'vue'
import Bugsnag from '@bugsnag/js'
import BugsnagPluginVue from '@bugsnag/plugin-vue'

Bugsnag.start({
  apiKey: '29094f9e852387f9cf1e6525b93d0ce9',
  plugins: [new BugsnagPluginVue()]
})

// eslint-disable-next-line no-unused-expressions
Bugsnag.getPlugin('vue')?.installVueErrorHandler(Vue)
