import Vue from 'vue'
import Bugsnag, { Plugin } from '@bugsnag/js'
import BugsnagPluginVue from '@bugsnag/plugin-vue'

Bugsnag.start({
  apiKey: '29094f9e852387f9cf1e6525b93d0ce9',
  plugins: [(new BugsnagPluginVue() as Plugin)],
  enabledReleaseStages: ['production']
})

Bugsnag.getPlugin('vue')?.installVueErrorHandler(Vue)
