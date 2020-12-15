<template>
  <div>测试进行中...</div>
</template>

<script>
export default {
  data () {
    return {
      taskId:'',
      pttHost: ['http://127.0.0.1:8082'],
      curPage: ''
    }
  },
  created () {
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
