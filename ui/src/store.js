const State = function () {
  this.user = {
    isVerified: false,
    email: ''
  }
  this.task = {
    pttUrl: '',
    steps: []
  }
}

export default {
  debug: process.env.NODE_ENV === 'development',
  state: {},
  userState: {
    isVerified: false,
    email: ''
  },
  taskState: {
    pttUrl: '',
    steps: []
  },
  init: function () {
    // 获取状态信息,并开启状态监听
    const stateStr = localStorage.getItem('state')
    if (stateStr) {
      this.state = JSON.parse(stateStr)
      if (this.debug) console.log('从本地存储获取初始状态,登录状态:' + this.state.user.isVerified)
    } else {
      if (this.debug) console.log('本地存储为空, 状态保持默认值')
      this.state = new State()
    }
  },
  save: function () {
    localStorage.setItem('state', JSON.stringify(this.state))
  },
  update: function (target = '', newBody) {
    if (this.debug) console.log('%s状态更新为：%o', target, newBody)
    for (const key in newBody) {
      if (Object.prototype.hasOwnProperty.call(newBody, key)) {
        // 判断是否已存储了当前属性,若没有则新增该属性
        if (!Object.prototype.hasOwnProperty.call(this.state[target], key)) {
          Object.defineProperty(this.state[target], key, {
            writable: true,
            enumerable: true,
            configurable: true
          })
        }
        const element = newBody[key]
        if (Array.isArray(element)) {
          this.state[target][key] = element.slice()
        } else {
          this.state[target][key] = element
        }
      }
    }
    this.save()
  },
  // update: function (newValue, target = '') {
  //   if (this.debug) console.log('更新存储:%o,到:%s', newValue, target)
  //   for (const key in newValue) {
  //     if (Object.prototype.hasOwnProperty.call(newValue, key)) {
  //       const element = newValue[key]
  //       // 判断是否已存储了当前属性,若没有则新增该属性
  //       if (!Object.prototype.hasOwnProperty.call(this.state[target], key)) {
  //         Object.defineProperty(this.state[target], key, {
  //           writable: true,
  //           enumerable: true,
  //           configurable: true
  //         })
  //       }
  //       if (Array.isArray(element)) {
  //         this.state[target][key] = element.slice()
  //       } else {
  //         this.state[target][key] = element
  //       }
  //     }
  //   }
  //   this.save()
  // },
  clear: function () {
    if (this.debug) console.log('清除存储信息')
    this.state = new State()
    this.save()
  }
}
