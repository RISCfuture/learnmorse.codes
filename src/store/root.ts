/* eslint-disable @typescript-eslint/no-empty-function */

import { StoreOptions } from 'vuex'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RootState {}

const root: StoreOptions<RootState> = {
  state() {},
  getters: {},
  mutations: {},
  actions: {}
}
export default root
