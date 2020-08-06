import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Tasks from '../views/Tasks.vue'
import TaskBoard from '../views/TaskBoard.vue'
import TestDetail from '../views/TestDetail.vue'
import Testing from '../views/Testing.vue'
import Setting from '../views/Setting.vue'
import appStore from '../store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    alias: '/tasks',
    name: 'Tasks',
    component: Tasks
  },
  {
    path: '/tasks/:taskId',
    name: 'TaskBoard',
    component: TaskBoard
  },
  {
    path: '/tasks/:taskId/testId',
    name: 'TestDetail',
    component: TestDetail
  },
  {
    path: '/tasks/:taskId/testing',
    name: 'Testing',
    component: Testing
  },
  {
    path: '/setting',
    name: 'Setting',
    component: Setting
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    props: {
      to: 'Tasks'
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const status = router.app.store.state
  if (to.name !== 'Login' && !status.isVerified) {
    console.log('登录超时, 跳转到登录页')
    next({ name: 'Login', props: { to: to.name } })
  } else next()
})

export default router
