import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    'user-token': null
  },
  getters: {
    getUserToken(state) {
      return state["user-token"]
    }
  },
  mutations: {
    setUserToken(state, payload) {
      state["user-token"] = payload
    }
  }
})
