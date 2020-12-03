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
      origin: '',
      steps: []
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
        const { cmd, content } = e.data
        switch (cmd) {
          case 'init':
            e.source.postMessage({
              cmd: 'ready'
            }, e.origin)
            break
          case 'post':
            // 接收保存新新动作
            this.steps.push(content)
        }
      } catch (error) {
        console.log('出错了')
      }
    })
  },
  methods: {
    startrec: function () {
      this.frame.contentWindow.postMessage({
        cmd: 'rec'
      }, this.origin)
    },
    submit: function () {
    }
  }
}
</script>

<style>

</style>
