import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Store from './store'

console.log(process.env.NODE_ENV)

Vue.config.productionTip = false

Store.init()
Vue.prototype.Store = Store

const ax = axios.create({
  baseURL: '/api'
})

// 添加响应拦截器
ax.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response
}, function (error) {
  if (Store.debug) console.log(error)
  if (error.response.status === 511) {
    sessionStorage.clear('user')
    sessionStorage.setItem('urlReq', error.config.url)
    router.push('/login')
  }
  return Promise.reject(error)
})

// 全局添加登录超时校验
router.beforeEach((to, from, next) => {
  const state = Store.state
  if (to.name !== 'Regist' && to.name !== 'Login' && !state.isVerified) {
    if (Store.debug) console.log('登录超时, 跳转注册页')
    next({ name: 'Regist', props: { to: to.name } })
  } else next()
})

Vue.use(VueAxios, ax)

new Vue({
  beforeCreate () {
  },
  created () {
  },
  methods: {
  },
  router: router,
  render: h => h(App)
}).$mount('#app')
