import Vue from "vue"
import VueRouter from "vue-router"

import Home from "@/views/Home.vue"
import Login from "@/views/Login.vue"
import Register from "@/views/Register.vue"
import PopularMovies from "@/views/PopularMovies.vue"
import PopularPeople from "@/views/PopularPeople.vue"
import AddActor from "@/views/AddActor.vue"

import store from '../store'

Vue.use(VueRouter)

const routes = [
  { path: "/", component: Home },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  { 
    path: "/logout",
    component: Register,
    beforeEnter: function(to, from, next) {
      store.commit("deauthenticate")
      if (from != "/")
        next("/")
    }
  },
  { path: "/movies", component: PopularMovies },
  { path: "/people", component: PopularPeople },
  {
    path: "/actor/add",
    component: AddActor,
    beforeEnter: function(to, from, next) {
      const userToken = store.getters.getUserToken
      const isAdmin = store.getters.getIsAdmin
      if (userToken != undefined && isAdmin)
        next()
      else
        next("/")
    }
  }
]

const router = new VueRouter({
  mode: "history",
  routes
})

export default router
