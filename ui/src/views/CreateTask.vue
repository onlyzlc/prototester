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
      <span class="tip" v-if="pttUrl !== '' && urlIsValid">URL OK</span>
      <span class="tip" v-else-if="pttUrl !== '' && urlIsValid === false">URL 无效</span>
    </div>
    <div>
      <iframe
        :src="pttUrl"
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
      urlIsValid: false
    }
  },
  mounted () {
    //   监听框架上传的消息
    window.addEventListener('message', this.receiveMsgFromWin, false)
  },
  watch: {
    pttUrl: function () {
      const url = this.pttUrl.trim()
      if (url === '') return
      if (url !== this.pttUrl) this.pttUrl = url
      else this.timmer = setTimeout(this.timeOutHandle, 5000)
    }
  },
  methods: {
    receiveMsgFromWin (e) {
      const eData = e.data
      const pttOrigin = e.origin
      // 判断是否为用户输入的地址发送的消息
      if (this.pttUrl.trim() === '') return
      if (e.origin !== new URL(this.pttUrl.trim()).origin) return
      if (this.Store.debug) { console.info('收到 %s 的消息： %o', pttOrigin, eData) }
      // 消息判断和处理
      switch (eData.status) {
        case 'init': {
          clearTimeout(this.timmer)
          this.pttUrl = eData.url
          break
        }
        case 'isReady': {
          clearTimeout(this.timmer)
          this.urlIsValid = true
          break
        }
      }
    },
    timeOutHandle () {
      console.info('原型超时未应答')
      this.urlIsValid = false
    }
  }
}
</script>

<style>
</style>
