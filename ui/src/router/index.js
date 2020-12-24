import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Regist from '../views/Regist.vue'
import Tasks from '../views/Tasks.vue'
import NewTask from '../views/NewTask.vue'
import TaskBoard from '../views/TaskBoard.vue'
import TestDetail from '../views/TestDetail.vue'
import Testing from '../views/Testing.vue'
import Setting from '../views/Setting.vue'
import Bye from '../views/Bye.Vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    alias: '/tasks',
    name: 'Tasks',
    component: Tasks
  },
  {
    path: '/tasks/new',
    name: 'NewTask',
    component: NewTask
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
    component: Testing,
    meta: { public: true },
    child: [
      {path: '/bye' , component: Bye}
    ]
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
    },
    meta: { public: true }
  },
  {
    path: '/regist',
    name: 'Regist',
    component: Regist,
    props: {
      to: 'Tasks' // 注册完成后默认返回的位置.
    },
    meta: { public: true }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
