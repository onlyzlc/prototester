<template>
  <div style="height:100%">
    <p>
      steps <span
        :disabled="redoOrder.length==0"
        style=""
        class="textBtn"
        @click="redo"
      >撤销</span>
    </p>
    <ul>
      <li
        v-for="step in task.steps"
        :key="step.timeStamp"
        class="step"
      >
        <template v-if="!step.isDel">
          <span class="des">
            {{ step.type }} [{{ step.target.nodeName }}]  {{ step.target.innerText || step.target.value }} at {{ step.timeStamp }}
          </span>
          <span
            class="delStep textBtn"
            @click="del(step.timeStamp)"
          >
            删除
          </span>
        </template>
      </li>
    </ul>
  </div>
</template>

<script>
// import LnDialog from '../components/Ln-Dialog.vue'
export default {
  components: {
  },
  data () {
    return {
      task: this.Store.state.task,
      steps: this.Store.state.task.steps,
      redoOrder: []
    }
  },
  created () {
    // window.addEventListener('message', (e) => {
    //   console.info('需要通过用户注册的原型地址实现来源限制, 当前来源:' + e.origin)
    //   // 需要通过用户注册的原型地址实现来源限制
    //   if (!this.pttHost.includes(e.origin)) {
    //     return false
    //   }
    //   // this.origin = e.origin
    //   console.log('收到 %s 消息: %o', e.origin, e.data)
    //   try {
    //     const { cmd, content } = e.data
    //     switch (cmd) {
    //       case 'init':
    //         e.source.postMessage({
    //           cmd: 'ready'
    //         }, e.origin)
    //         break
    //       case 'post':
    //         // 接收保存新新动作
    //         content.isDel = false
    //         this.steps.push(content)
    //     }
    //   } catch (error) {
    //     console.log('出错了')
    //   }
    // })
  },
  methods: {
    del: function (t) {
      const i = this.steps.findIndex(item => item.timeStamp === t)
      this.steps[i].isDel = true
      this.redoOrder.push(i)
    },
    redo: function () {
      const i = this.redoOrder.pop()
      this.steps[i].isDel = false
    },
    save: function () {
      this.$http.post('/tasks', {
        steps: this.steps.filter(item => !item.isDel)
      }).then(response => {
        // todo 成功后跳转
        if (response.status === 201) {
          console.log('任务创建成功，正在跳转回任务列表')
          location.href = this.pttUrl
        }
      })
    },
    cancel: function () {

    }
  }
}
</script>

<style>

</style>
