import Vue from "vue"
import VueRouter from "vue-router"

import Home from "@/views/Home.vue"
import Login from "@/views/Login.vue"
import Register from "@/views/Register.vue"
import AllMovies from "@/views/AllMovies.vue"
import PopularPeople from "@/views/PopularPeople.vue"
import AddActor from "@/views/AddActor.vue"
import AddMovie from "@/views/AddMovie.vue"
import MovieDetails from "@/views/MovieDetails.vue"
import FavouriteMovies from "@/views/FavouriteMovies.vue"
import PopularMovies from "@/views/PopularMovies.vue"

import store from '../store'

Vue.use(VueRouter)

const routes = [{
    path: "/",
    component: Home
  },
  {
    path: "/login",
    component: Login
  },
  {
    path: "/register",
    component: Register
  },
  {
    path: "/logout",
    component: Register,
    beforeEnter: function(to, from, next) {
      store.commit("deauthenticate")
      if (from != "/")
        next("/")
    }
  },
  {
    path: "/movies",
    component: AllMovies
  },
  {
    path: "/movies/add",
    component: AddMovie,
    beforeEnter: function(to, from, next) {
      const userToken = store.getters.getUserToken
      const isAdmin = store.getters.getIsAdmin
      if (userToken != undefined && isAdmin)
        next()
      else
        next("/")
    }
  },
  {
    path: "/movies/favourite",
    component: FavouriteMovies,
    beforeEnter: function(to, from, next) {
      const userToken = store.getters.getUserToken
      if (userToken != undefined)
        next()
      else
        next("/")
    }
  },
  {
    path: "/movies/popular",
    component: PopularMovies
  },
  {
    path: "/movies/:movieId",
    component: MovieDetails
  },
  {
    path: "/people",
    component: PopularPeople
  },
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

router.beforeEach((to, from, next) => {
  /* Deauthenticate user after 120 min */
  const loginTime = store.getters.getLoginTime
  const currentTime = Date.now()
  const expirationDate = loginTime + (60 * 60 * 1000)
  if (currentTime >= expirationDate) {
    store.commit("deauthenticate")
  }

  next()
})

export default router
