import Vue from 'vue'
import Vuex from 'vuex'
import root from '@/store/root'
import lesson from '@/store/lesson'

Vue.use(Vuex)

export default new Vuex.Store({
  ...root,
  modules: { lesson }
})
