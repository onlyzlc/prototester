<template>
  <div>
    <div>
      <button @click="startrec">
        开始记录
      </button>
      <button @click="submit">
        提交记录
      </button>
    </div>
    <iframe
      :src="pttUrl"
      frameborder="0"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      pttHost: ['http://127.0.0.1:8082'],
      pttUrl: this.Store.state.pttUrl,
      origin: ''
    }
  },
  computed: {
    frame: () => document.querySelector('iframe')
  },
  created () {
    window.addEventListener('message', (e) => {
      console.info('需要通过用户注册的原型地址实现来源限制, 当前来源:' + e.origin)
      // 需要通过用户注册的原型地址实现来源限制
      if (!this.pttHost.includes(e.origin)) {
        return false
      }
      this.origin = e.origin
      console.log(e.data)
      try {
        const [magHead] = e.data.split('?')
        switch (magHead) {
          case 'Penny':
            e.source.postMessage('ready', e.origin)
            // e.source.postMessage('loadMonitor', e.origin)
            break
        }
      } catch (error) {
        console.log('出错了')
      }
    })
  },
  methods: {
    startrec: function () {
      this.frame.contentWindow.postMessage('rec', this.origin)
    },
    submit: function () {
      const log = []
      const l = sessionStorage.length
      for (let i = 0; i === l; i++) {
        const key = sessionStorage.key(i)
        log.push(sessionStorage.getItem(key))
        sessionStorage.removeItem(key)
      }
      
    }
  }
}
</script>

<style>

</style>
