import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    'user-token': null,
    'isAdmin': false
  },
  getters: {
    getUserToken(state) {
      return state["user-token"]
    },
    getIsAdmin(state) {
      return state.isAdmin
    }
  },
  mutations: {
    setUserToken(state, payload) {
      state["user-token"] = payload
    },
    setIsAdmin(state, payload) {
      state.isAdmin = payload
    }
  }
})
