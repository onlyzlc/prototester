<template>
  <div class="container">
    <div class="left">
      <router-view />
    </div>
    <div class="right">
      <rec-frame
        :url="pttUrl"
        :status="status"
        @reciveCmd="processCmd"
      />
    </div>
  </div>
</template>

<script>
import RecFrame from '../components/Rec-Frame.vue'
export default {
  components: {
    RecFrame
  },
  props: ['taskId'],
  data () {
    return {
      task: this.Store.state.task,
      // pttHost: ['http://127.0.0.1:8082'],
      pttUrl: '',
      status: 'disabled'
    }
  },
  created () {
    console.log('task已创建')
    this.fetchTask()
    // window.addEventListener('message', (e) => {
    //   console.info('需要通过用户注册的原型地址实现来源限制, 当前来源:' + e.origin)
    //   // 需要通过用户注册的原型地址实现来源限制
    //   if (!this.pttHost.includes(e.origin)) {
    //     return false
    //   }
    //   // this.origin = e.origin
    //   console.log('收到%s的消息: %o', e.origin, e.data)
    //   try {
    //     const { cmd, content } = e.data
    //     switch (cmd) {
    //       case 'init':
    //         // this.status = 'disabled'
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
    processCmd: function (cmd, content) {
      console.log('组件已收到recframe传递的消息 %s', cmd)
    },
    fetchTask (next) {
      // 获取数据
      this.$http
        .get(`/tasks/${this.taskId}`)
        .then((result, vm = this) => {
          const task = result.data
          vm.Store.update('task', task)
          this.pttUrl = (task.steps.length) ? task.steps[0].url : task.ptt.url
        })
      if (next) next()
    }
  }
}
</script>

<style>
html,
body,
#app {
  height: 100%;
}
.controlbar {
  background-color: antiquewhite;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.container {
  display: flex;
  height: calc(100% - 40px);
}
.container .left {
  font-size: 0.8em;
  width: 400px;
  border-left: 1px solid red;
}
.container .right {
  flex: 1;
}
.right ul {
  padding: 0 10px;
}
.step {
  display: flex;
}
.step .des {
  flex: 1;
}
.textBtn {
  color: red;
}
.textBtn:hover {
  cursor: pointer;
}
.textBtn[disabled] {
  cursor: default;
  color: gray;
}
</style>
