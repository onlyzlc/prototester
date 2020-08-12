import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Regist from '../views/Regist.vue'
import Tasks from '../views/Tasks.vue'
import TaskBoard from '../views/TaskBoard.vue'
import TestDetail from '../views/TestDetail.vue'
import Testing from '../views/Testing.vue'
import Setting from '../views/Setting.vue'

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
      to: 'Tasks' // 登陆后默认返回的位置.
    }
  },
  {
    path: '/regist',
    name: 'Regist',
    component: Regist,
    props: {
      to: 'Tasks' // 注册完成后默认返回的位置.
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
