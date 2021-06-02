<template>
  <load-panel :status="maskStatus">
    <iframe
      :src="url"
      frameborder="0"
      style="width: 100%; height: 100%"
    />
  </load-panel>
</template>

<script>
import LoadPanel from './Load-Panel'
export default {
  name: 'RecFrame',
  components: {
    LoadPanel
  },
  props: {
    url: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      default: 'init'
    }
  },
  data () {
    return {
      pttHost: ['http://127.0.0.1:8082']
    }
  },
  computed: {
    frame: () => document.querySelector('iframe'),
    maskStatus: function () {
      if (this.url === '' || this.status === 'init') return 'loading'
      else if (this.status === 'disabled') return 'disabled'
      else return ''
    }
  },
  watch: {
    status: function (val) {
      this.send(val)
    }
  },
  created () {
    console.log('load rec frame')
    window.addEventListener('message', this.reciveMsg)
  },
  destroyed () {
    // 必须, 路由中跳转时, window 是不变的, 而每导航到一个页面, created 时都会给 同一个 window 添加一个监听器.
    // 为避免上述情况, 需在组件销毁时手动移除 window 上的监听器, 否在会不断重复设置监听器
    window.removeEventListener('message', this.reciveMsg)
  },
  methods: {
    reciveMsg: function (e) {
      // 需要通过用户注册的原型地址实现来源限制
      if (!this.pttHost.includes(e.origin)) {
        console.info('非法来源: %s: , %o', e.origin, e.data)
        return false
      }
      console.log('收到%s的消息: %o', e.origin, e.data)
      try {
        const { cmd, content } = e.data
        if (cmd === 'init') {
          this.send(this.status)
        }
        this.$emit('reciveCmd', cmd, content)
      } catch (error) {
        console.log('出错了')
      }
    },
    send: function (msg) {
      this.frame.contentWindow.postMessage({
        cmd: msg
      }, this.url)
    }
  }
}
</script>

<style>
</style>
