<template>
  <div>
    <div>
      <form @submit.prevent="submit">
        <label for="ipturl">原型链接</label>
        <input
          id="ipturl"
          v-model="ipturl"
          name="ipturl"
          type="url"
          placeholder="http://protomanager.com/yourproto"
          required
        >
        <button type="submit">确定</button>
        <input type="checkbox" id="retry" v-model="retry">
        <label for="retry">自动重试</label>
      </form>
      <template v-if = "ipturl.trim() !== ''">
        <div class="tip" v-if="urlState !== ''" v-html="urlState"></div>
        <div>
          <iframe
            :src="iframeSrc"
            frameborder="0"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      ipturl: '', // 用户输入的url
      iframeSrc: '', // 绑定到框架src，自动去除首尾空格，提交时赋值，可利用html原生url类型校验，避免无效url。
      urlState: '', // 文字描述用户地址的具体情况
      retry: false, // 自动重试
      retryDur: 6000 // 重试间隔
    }
  },
  mounted () {
    // 监听框架上传的消息
    window.addEventListener('message', this.receiveMsgFromWin, false)
  },
  watch: {
    ipturl () {
      if (!this.ipturl.startsWith('http://') && !this.ipturl.startsWith('https://')) {
        this.urlState = "地址应以 'http://'或'https://' 开头"
      } else {
        this.urlState = ''
      }
    }
  },
  methods: {
    submit () {
      // 去空格
      const url = this.ipturl.trim()
      // 如果为空或者没变, 则不管
      if (url === '' || url === this.iframeSrc) return false
      if (!url.startsWith('http:') && !url.startsWith('https:')) return false

      if (this.reloadTimer) clearInterval(this.reloadTimer)
      this.urlState = '正在检查地址...'
      this.iframeSrc = url
      // 设定超时重试处理
      this.reloadTimer = setInterval(this.reload, this.retryDur, url)
    },
    receiveMsgFromWin (e) {
      if (this.iframeSrc === '') return
      const eData = e.data
      const pttOrigin = e.origin
      // 判断是否为用户输入的地址发送的消息
      try {
        if (new URL(this.iframeSrc).origin === e.origin) {
          if (this.Store.debug) { console.info('收到 %s 的消息： %o', pttOrigin, eData) }
          // 消息判断和处理
          switch (eData.status) {
            case 'init': {
              this.urlState = '原型地址定位中...'
              this.iframeSrc = eData.url
              clearInterval(this.reloadTimer)
              break
            }
            case 'isReady': {
              this.urlState = '原型已准备好, 可以开始创建任务'
              clearInterval(this.reloadTimer)
              break
            }
          }
        } else if (this.Store.debug) console.log('消息来源不是用户输入的地址')
      } catch (error) {
        if (this.Store.debug) console.error(error)
      }
    },
    reload (url) {
      // 如果不自动重试,则取消定时器
      this.urlState = "此地址或许没有加入插件，<a href='/help'>如何给原型添加插件？</a>"
      if (!this.retry) {
        clearInterval(this.reloadTimer)
        return
      }
      this.urlState += ', 正在刷新重试...'
      // iframe重载
      this.iframeSrc = ''
      const _url = url
      setTimeout(() => {
        this.iframeSrc = _url
      }, this.retryDur / 2)
    }
  }
}
</script>

<style>
iframe {
  width: 100%;
  height: 100%;
}
</style>
