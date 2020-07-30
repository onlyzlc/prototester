export default {
  debug: true,
  state: {
    isVerified: false
  },
  init: function () {
    // 获取状态信息,并开启状态监听
    const stateStr = localStorage.getItem('state')
    if (stateStr) {
      if (this.debug) console.log('从本地存储获取初始状态')
      this.state = JSON.parse(stateStr)
    } else {
      if (this.debug) console.log('本地存储为空, 状态保持默认值')
    }
  },
  save: function () {
    localStorage.setItem('state', JSON.stringify(this.state))
  }
}
