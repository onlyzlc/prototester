<template>
  <div>
    测试进行中...
    <button @click="startrec">
      开始
    </button>
    <iframe
      :src="step_keys[0].url"
      frameborder="0"
      style="width: 100%; height: 100%"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      taskId: '',
      step_keys: [],
      pttHost: ['http://127.0.0.1:8082'],
      pttUrl: ''
    }
  },
  created () {
    window.addEventListener('message', this.reciveMsg, false)
    // 获取当前任务ID
    this.taskId = this.$route.params.taskId
    // 获取任务数据
    this.$http
      .get(`/tasks/${this.taskId}/startstop`)
      .then((res) => (this.step_keys = res.data))
    // this.pttUrl = this.step_keys[0].url
    // 查看能否在插件框架中
    // this.getSteps()
  },
  methods: {
    reciveMsg (e) {
      console.info('需要通过用户注册的原型地址实现来源限制, 当前来源:' + e.origin)
      // 需要通过用户注册的原型地址实现来源限制
      if (!this.pttHost.includes(e.origin)) {
        return false
      }
      console.log(e.data)
      try {
        // const [cmd, content] = e.data.split('?')
        const { cmd } = e.data
        switch (cmd) {
          case 'init': {
            // 框架加载后,sodar.js会发送init消息来表示已准备好
            // 这里作为父页面收到后,返回 ready 指令
            e.source.postMessage({
              cmd: 'ready'
            }, e.origin)
            // e.source.postMessage('href', e.origin)
            break
          }
        }
      } catch (error) {
        console.log('出错了')
      }
    }
  }
}
</script>

<style>

</style>
