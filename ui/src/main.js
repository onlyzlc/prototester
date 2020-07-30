import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import appStore from './store'

console.log(process.env.NODE_ENV)

const ax = axios.create({
  baseURL: '/api'
})

// 添加响应拦截器
ax.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response
}, function (error) {
  console.log(error)
  if (error.response.status === 511) {
    sessionStorage.clear('user')
    sessionStorage.setItem('urlReq', error.config.url)
    router.push('/loginReg')
  }
  return Promise.reject(error)
})

Vue.use(VueAxios, ax)

Vue.config.productionTip = false

new Vue({
  beforeCreate () {
    appStore.init()
  },
  created () {
  },
  methods: {
  },
  router: router,
  render: h => h(App)
}).$mount('#app')
