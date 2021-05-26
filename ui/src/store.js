export default {
  debug: process.env.NODE_ENV === 'development',
  state: {
    user: {
      isVerified: false,
      email: ''
    },
    ptt: {
      url: ''
    },
    task: {
      steps: []
    }
  },
  init: function () {
    // 获取状态信息,并开启状态监听
    const stateStr = localStorage.getItem('state')
    if (stateStr) {
      this.state = JSON.parse(stateStr)
      if (this.debug) console.log('从本地存储获取初始状态,登录状态:' + this.state.user.isVerified)
    } else {
      if (this.debug) console.log('本地存储为空, 状态保持默认值')
    }
  },
  save: function () {
    localStorage.setItem('state', JSON.stringify(this.state))
  },
  // update: function (newValue) {
  //   if (this.debug) console.log('更新存储:%o', newValue)
  //   for (const key in newValue) {
  //     if (Object.prototype.hasOwnProperty.call(newValue, key)) {
  //       const element = newValue[key]
  //       // 判断是否已存储了当前属性,若没有则新增该属性
  //       if (!Object.prototype.hasOwnProperty.call(this.state, key)) {
  //         Object.defineProperty(this.state, key, {
  //           writable: true,
  //           enumerable: true,
  //           configurable: true
  //         })
  //       }
  //       if (Array.isArray(element)) {
  //         this.state[key] = element.slice()
  //       } else {
  //         this.state[key] = element
  //       }
  //     }
  //   }
  //   this.save()
  // },
  update: function (newValue, target = '') {
    if (this.debug) console.log('更新存储:%o,到:%s', newValue, target)
    for (const key in newValue) {
      if (Object.prototype.hasOwnProperty.call(newValue, key)) {
        const element = newValue[key]
        // 判断是否已存储了当前属性,若没有则新增该属性
        if (!Object.prototype.hasOwnProperty.call(this.state[target], key)) {
          Object.defineProperty(this.state[target], key, {
            writable: true,
            enumerable: true,
            configurable: true
          })
        }
        if (Array.isArray(element)) {
          this.state[target][key] = element.slice()
        } else {
          this.state[target][key] = element
        }
      }
    }
    this.save()
  },
  clear: function () {
    if (this.debug) console.log('清除存储信息')
    this.state.user.isVerified = false
    this.state.user.email = ''
    this.state.ptt.url = ''
    this.save()
  }
}
