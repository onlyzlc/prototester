<template>
  <div>
    <h1>创建新任务</h1>
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
      pttUrl: this.Store.state.pttUrl
    }
  },
  created () {
    window.addEventListener('message', (e) => {
      console.info('需要通过用户注册的原型地址实现来源限制, 当前来源:' + e.origin)
      // 需要通过用户注册的原型地址实现来源限制
      if (!this.pttHost.includes(e.origin)) {
        return false
      }
      console.log(e.data)
      try {
        const [magHead] = e.data.split('?')
        switch (magHead) {
          case 'Penny':
            e.source.postMessage('ready', e.origin)
            e.source.postMessage('loadMonitor', e.origin)
            break
        }
      } catch (error) {
        console.log('出错了')
      }
    })
  }
}
</script>

<style>

</style>
