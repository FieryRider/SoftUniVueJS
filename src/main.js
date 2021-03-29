import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import Vuelidate from 'vuelidate'
import store from './store'
import router from './router'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faEllipsisV, faCircle, faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon, FontAwesomeLayers } from '@fortawesome/vue-fontawesome'

library.add(faEllipsisV, faCircle, faCheck)
Vue.component("font-awesome-icon", FontAwesomeIcon)
Vue.component("font-awesome-layers", FontAwesomeLayers)

Vue.config.productionTip = false

Vue.use(VueRouter)
Vue.use(Vuelidate)

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
