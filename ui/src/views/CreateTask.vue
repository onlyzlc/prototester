<template>
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
      <button type="submit">
        确定
      </button>
      <input
        id="retry"
        v-model="retry"
        type="checkbox"
      >
      <label for="retry">自动重试</label>
    </form>
    <iframe
      :src="iframeSrc"
      frameborder="0"
    />
    <template v-if="iframeSrc !== ''">
      <div
        v-if="urlState !== ''"
        class="tip"
        v-html="urlState"
      />
      <button v-if="pass">
        从这个页面上创建任务
      </button>
      <div id="capture">
        <div
          class="thumbnail"
          :style="{ backgroundImage: 'url(' + thumbnail + ')' }"
        />
        <!-- <img :src="thumbnail" alt="" class="thumbnail"> -->
      </div>
    </template>
  </div>
</template>

<script>
export default {
  data () {
    return {
      ipturl: '', // 用户输入的url
      iframeSrc: '', // 绑定到框架src，自动去除首尾空格，提交时赋值，可利用html原生url类型校验，避免无效url。
      urlState: '', // 文字描述用户地址的具体情况
      pass: false,
      retry: false, // 自动重试
      retryDur: 6000, // 重试间隔
      thumbnail: '' // 从iframe中传输的 采用canvas克隆DOM的截图dataurl
    }
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
  mounted () {
    // 监听框架上传的消息
    window.addEventListener('message', this.receiveMsgFromWin, false)
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
      this.pass = false
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
              this.urlState = '稍等一下...'
              this.iframeSrc = eData.url
              clearInterval(this.reloadTimer)
              break
            }
            case 'isReady': {
              clearInterval(this.reloadTimer)
              this.urlState = ''
              this.thumbnail = eData.imageData
              this.pass = true
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
  width: 1920px;
  height: 0;
  position: fixed;
}
#capture{
  width: 80%;
  height: 600px;
  margin: auto;
  margin-top: 4em;
  border-radius: 8px;
  box-sizing: border-box;
  box-shadow: 1px 1px 8px 0px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.thumbnail {
  position: absolute;
  width: 100%;
  height: 100%;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 100%;
  transition: all 500ms;
  z-index: -1;
}
#capture:hover .thumbnail{
  filter: blur(1px);
}
#capture button{
  padding: 0.5em 1em;
  border-radius: 2em;
  border: 0;
}
input[type='url']{
  width: 30em;
}
</style>
