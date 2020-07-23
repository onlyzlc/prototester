import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'

var ax = axios.create({
  baseURL: 'http://localhost:8081/api/',
  timeout: 1000,
});

Vue.use(VueAxios, ax)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
