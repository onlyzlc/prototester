<template>
  <div>测试进行中...
    <iframe
          :src="pttUrl"
          frameborder="0"
          style="width: 100%; height: 100%"
        />
  </div>
  
</template>

<script>
export default {
  data () {
    return {
      taskId:'',
      step_first: {},
      step_end: {},
      pttHost: ['http://127.0.0.1:8082'],
      pttUrl: ''
    }
  },
  created () {
    // 获取当前任务ID
    this.taskId = this.$route.taskId
    // 获取任务数据
    this.$http
      .get(`/tasks/${this.taskId}/startstop`)
      .then( (res)=> {
        this.step_first = res[0] 
        this.step_end = res[1]
      })
    this.pttUrl = this.step_first.url
    // 查看能否在插件框架中
    window.addEventListener('message', this.reciveMsg, false)
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
        const { cmd, content } = e.data
        switch (cmd) {
          case 'init': {
            // 发送原型页面链接命令
            e.source.postMessage({
              cmd: 'taskId'
            }, e.origin)
            // e.source.postMessage('href', e.origin)
            break
          }
          // 接收原型链接
          case 'taskId': {
            this.taskId = content
            this.Store.update({ pttUrl: content })
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
