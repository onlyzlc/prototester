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
  baseURL: '/api',
  timeout: 20000
})

ax.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
ax.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response
}, function (error) {
  if (Store.debug) console.log(error)
  // 如果登录过期了
  if (error.response.status === 511) {
    sessionStorage.clear('user')
    sessionStorage.setItem('urlReq', error.config.url)
    Store.clear()
    router.push({ name: 'Login' })
  }
  return Promise.reject(error)
})

// 全局添加登录超时校验
router.beforeEach((to, from, next) => {
  // 免登录页面
  // const publicPage = /Regist|Login|Testing/    publicPage.test(to.name)
  // 如果是需要权限的页面,则判断是否已登录
  // 若已登录则继续
  // 若未登录则跳转到注册页面
  if (to.matched.some(record => record.meta.requireAuth)) {
    if (Store.userStatetate.isVerified) next()
    else {
      if (Store.debug) console.log('登录超时, 跳转注册页')
      next({ name: 'Regist', props: { to: to.name } })
    }
  } else {
    next()
  }
})

Vue.use(VueAxios, ax)

new Vue({
  router: router,
  render: h => h(App)
}).$mount('#app')
