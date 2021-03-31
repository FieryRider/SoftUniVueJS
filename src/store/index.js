import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

const initialState = () => ({
  'user-token': localStorage.getItem("user-token"),
  'isAdmin': localStorage.getItem("isAdmin") ? localStorage.getItem("isAdmin") : false,
  'loginTime': localStorage.getItem("loginTime") ? localStorage.getItem("loginTime") : 0
})

export default new Vuex.Store({
  state: {
    ...initialState()
  },
  getters: {
    getUserToken(state) {
      return state["user-token"]
    },
    getIsAdmin(state) {
      return state.isAdmin
    },
    getLoginTime(state) {
      return state.loginTime
    }
  },
  mutations: {
    setUserToken(state, payload) {
      state['user-token'] = payload
      localStorage.setItem("user-token", payload)
    },
    setIsAdmin(state, payload) {
      state.isAdmin = payload
      localStorage.setItem("isAdmin", payload)
    },
    setLoginTime(state) {
      const currentTime = Date.now()
      state['loginTime'] = currentTime
      localStorage.setItem('loginTime', currentTime)
    },
    resetState(state) {
      Object.assign(state, initialState())
    },
    deauthenticate(state) {
      state.isAdmin = false
      state['user-token'] = null
      localStorage.removeItem("user-token")
      localStorage.removeItem("isAdmin")
    }
  }
})
