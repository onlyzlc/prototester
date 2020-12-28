import Vue from 'vue'
import VueRouter from 'vue-router'

import About from '../views/About.vue'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Regist from '../views/Regist.vue'
import Tasks from '../views/Tasks.vue'
import Task from '../views/Task.vue'
import TaskBoard from '../views/TaskBoard.vue'
import NewTask from '../views/NewTask.vue'
import RecordSteps from '../views/RecordSteps.vue'
import Steps from '../views/Steps.vue'
import Testlog from '../views/Testlog.vue'
import UserTest from '../views/UserTest.vue'
import Testing from '../views/Testing.vue'
import Profile from '../views/Profile.vue'
import Thanks from '../views/Thanks.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/about',
    name: 'About',
    component: About,
    children: [
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
  },
  {
    path: '/how-do-you',
    component: UserTest,
    children: [
      {
        path: ':taskId',
        name: 'Testing',
        component: Testing,
        props: true
      },
      {
        path: '/thanks',
        name: 'Thanks',
        component: Thanks
      }
    ]
  },
  {
    path: '/',
    redirect: '/tasks',
    component: Home,
    meta: { requireAuth: true },
    children: [
      {
        path: '/tasks',
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
        alias: '/tasks/:taskId/detail',
        props: true,
        component: Task,
        children: [
          {
            path: '/tasks/:taskId/detail',
            name: 'TaskBoard',
            component: TaskBoard
          },
          {
            path: 'testlog/:yyyy/:mm/:dd/:testnum',
            name: 'Testlog',
            component: Testlog,
            props: true
          },
          {
            path: 'steps',
            name: 'Steps',
            component: Steps
          }
        ]
      },
      {
        path: '/tasks/:taskId/recordsteps',
        name: 'RecordSteps',
        component: RecordSteps
      },
      {
        path: '/:userName',
        name: 'Profile',
        component: Profile,
        props: true
      }
    ]
  }
]
// -------
// {
//   path: '/',
//   alias: '/tasks',
//   name: 'Tasks',
//   component: Tasks
// },
// {
//   path: '/tasks/new',
//   name: 'NewTask',
//   component: NewTask
// },
// {
//   path: '/tasks/:taskId',
//   name: 'TaskBoard',
//   component: TaskBoard
// },
// {
//   path: '/tasks/:taskId/testId',
//   name: 'TestDetail',
//   component: TestDetail
// },
// {
//   path: '/tasks/:taskId/testing',
//   name: 'Testing',
//   component: Testing,
//   meta: { public: true }
// },
// {
//   path: '/bye',
//   name: 'Bye',
//   component: Bye
// },
// {
//   path: '/setting',
//   name: 'Setting',
//   component: Setting
// },
// {
//   path: '/login',
//   name: 'Login',
//   component: Login,
//   props: {
//     to: 'Tasks' // 登陆后默认返回的位置.
//   },
//   meta: { public: true }
// },
// {
//   path: '/regist',
//   name: 'Regist',
//   component: Regist,
//   props: {
//     to: 'Tasks' // 注册完成后默认返回的位置.
//   },
//   meta: { public: true }
// }

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
