<template>
  <div>
    <div class>
      <label for="pttUrl">原型链接</label>
      <input
        id="pttUrl"
        v-model="pttUrl"
        name="pttUrl"
        type="url"
      >
      <template v-if = "pttUrl.trim() !== ''">
        <span class="tip" v-if="urlIsValid">URL OK</span>
        <span class="tip" v-else-if="iframeSrc !== ''" >URL 无效</span>
      </template>
    </div>
    <div>
      <iframe
        :src="iframeSrc"
        frameborder="0"
      />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      pttUrl: '',
      iframeSrc: '',
      urlIsValid: false
    }
  },
  mounted () {
    // 监听框架上传的消息
    window.addEventListener('message', this.receiveMsgFromWin, false)
  },
  watch: {
    pttUrl: function () {
      // 去空格
      const url = this.pttUrl.trim()
      // 如果为空或者没变, 则不管
      if (url === '' || url === this.iframeSrc) return
      // 若有修改则清除,重置定时器
      if (this.lazyLoadTimer) clearTimeout(this.lazyLoadTimer)
      if (this.reloadTimer) clearInterval(this.reloadTimer)
      // 延时加载框架
      this.lazyLoadTimer = setTimeout(this.lazyLoad, 1000, url)
    }
  },
  methods: {
    receiveMsgFromWin (e) {
      if (this.iframeSrc === '') return
      const eData = e.data
      const pttOrigin = e.origin
      // 判断是否为用户输入的地址发送的消息
      if (new URL(this.iframeSrc).origin === e.origin) {
        if (this.Store.debug) { console.info('收到 %s 的消息： %o', pttOrigin, eData) }
        this.urlIsValid = true
        clearInterval(this.reloadTimer)
        // 消息判断和处理
        switch (eData.status) {
          case 'init': {
            this.iframeSrc = eData.url
            break
          }
          case 'isReady': {
            this.urlIsValid = true
            break
          }
        }
      }
    },
    timeReload (url) {
      console.info('原型超时未应答')
      this.urlIsValid = false
      // iframe重载
      this.iframeSrc = url
    },
    lazyLoad (url) {
      try {
        let fullUrl = url
        // 检查是否有协议标头
        if (!fullUrl.startsWith('http:') && !fullUrl.startsWith('https:')) fullUrl = 'http://' + fullUrl
        // 检查是否为有效的URL格式
        const src = new URL(fullUrl)
        // 设置框架链接, 立即加载
        this.iframeSrc = src.href
        // 超时循环加载
        this.reloadTimer = setInterval(this.timeReload, 8000, src.href)
      } catch (error) {
        // URL无效
        this.iframeSrc = ''
        this.urlIsValid = false
      }
    }
  }
}
</script>

<style>
</style>
