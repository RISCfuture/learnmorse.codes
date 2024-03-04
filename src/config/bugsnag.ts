import Bugsnag from '@bugsnag/js'
import BugsnagPerformance from '@bugsnag/browser-performance'
import BugsnagPluginVue from '@bugsnag/plugin-vue'

Bugsnag.start({
  apiKey: '29094f9e852387f9cf1e6525b93d0ce9',
  plugins: [new BugsnagPluginVue()],
  enabledReleaseStages: ['production'],
  releaseStage: import.meta.env.MODE
})
BugsnagPerformance.start('29094f9e852387f9cf1e6525b93d0ce9')

const bugsnagVue = Bugsnag.getPlugin('vue')
export default bugsnagVue
