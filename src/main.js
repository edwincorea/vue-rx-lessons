import "buefy/lib/buefy.css";

import Vue from 'vue'
import App from './App.vue'

import * as Rx from "rxjs"
import * as VueRx from "vue-rx"

import buefy from "buefy"

import axios from "axios"
import VueAxios from "vue-axios"

Vue.use(VueRx, Rx)
Vue.use(buefy)
Vue.use(VueAxios, axios)

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
