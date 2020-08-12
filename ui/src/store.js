export default {
  debug: process.env.NODE_ENV === 'development',
  state: {
    isVerified: false,
    email: ''
  },
  init: function () {
    // 获取状态信息,并开启状态监听
    const stateStr = localStorage.getItem('state')
    if (stateStr) {
      this.state = JSON.parse(stateStr)
      if (this.debug) console.log('从本地存储获取初始状态,登录状态:' + this.state.isVerified)
    } else {
      if (this.debug) console.log('本地存储为空, 状态保持默认值')
    }
  },
  save: function () {
    localStorage.setItem('state', JSON.stringify(this.state))
  },
  updateUser: function (newValue) {
    if (this.debug) console.log('更新用户状态信息:%o', newValue)
    const { isVerified, email } = newValue
    this.state.isVerified = isVerified
    this.state.email = email
    this.save()
  },
  clear: function () {
    this.state.isVerified = false
    this.state.email = ''
    this.save()
  }
}
