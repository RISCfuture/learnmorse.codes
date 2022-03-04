import Vue from 'vue'
import Bugsnag, { Plugin } from '@bugsnag/js'
import BugsnagPluginVue from '@bugsnag/plugin-vue'

Bugsnag.start({
  apiKey: '29094f9e852387f9cf1e6525b93d0ce9',
  plugins: [<Plugin> new BugsnagPluginVue()],
  enabledReleaseStages: ['production']
})

// eslint-disable-next-line no-unused-expressions
Bugsnag.getPlugin('vue')?.installVueErrorHandler(Vue)
