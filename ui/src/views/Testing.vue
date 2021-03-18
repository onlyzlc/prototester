<template>
  <div>
    <ln-dialog
      :vis="vis.tip"
      @click-primary="startTest"
    >
      {{ tip }}
    </ln-dialog>
    <ln-dialog
      :vis="isPublished"
      @click-primary="leave"
    >
      {{ tip }}
    </ln-dialog>
    <ln-dialog
      :vis="vis.tip_completed"
      @click-primary="leaveTest"
    >
      啊妹惊, 您完成了这个不可能的任务!!!
    </ln-dialog>
    <rec-frame
      v-if='isPublished'
      :url="pttUrl"
      :status="status"
    />
  </div>
</template>

<script>
import LnDialog from '../components/Ln-Dialog.vue'
import RecFrame from '../components/Rec-Frame.vue'
export default {
  components: {
    RecFrame,
    LnDialog
  },
  data () {
    return {
      taskId: this.$route.params.taskId,
      taskNote: {},
      pttHost: ['http://127.0.0.1:8082'],
      status: 'init',
      pttUrl: '',
      tip: '',
      stop: {},
      log: [],
      isCompleted: false,
      isPublished: true,
      vis: {
        tip: true,
        tip_completed: false,
      }
    }
  },
  created () {
    window.addEventListener('message', this.reciveMsg, false)
    // 获取当前任务ID
    // 获取任务数据
    this.$http
      .get(`/tasks/${this.taskId}/taskNote`)
      .then(function (res) {
        switch (res.status) {
          case 200:
            this.store(res.data)
            break
          case 204:
            this.isPublished = false
            break
          default:
            this.$router.push('Error')
            break
        }
      })
  },
  methods: {
    store (taskNote) {
      this.pttUrl = taskNote.steps[0].url
      this.tip = taskNote.description
      this.stop = taskNote.steps[1]
    },
    reciveMsg (e) {
      console.info('需要通过用户注册的原型地址实现来源限制, 当前来源:' + e.origin)
      // 需要通过用户注册的原型地址实现来源限制
      if (!this.pttHost.includes(e.origin)) {
        return false
      }
      console.log('收到 %s 消息: %o', e.origin, e.data)
      try {
        // const [cmd, content] = e.data.split('?')
        const { cmd, content } = e.data
        switch (cmd) {
          case 'init':
            // 框架加载后,sodar.js会发送init消息来表示已准备好
            // 这里作为父页面收到后,返回 ready 指令
            e.source.postMessage({
              cmd: 'ready'
            }, e.origin)
            // e.source.postMessage('href', e.origin)
            break
          case 'post':
            // 判断是否触发最后一步;
            if (content.type === this.stop.type &&
                content.target.id === this.stop.target.id &&
                content.target.nodeName.toLowerCase() === this.stop.target.nodeName &&
                content.target.value === this.stop.target.value) {
              this.isCompleted = true
              this.log.push(content)
              this.sendLog()
              this.status = 'stop'
              this.vis.tip_completed = true
            } else {
              this.log.push(content)
              if (this.log.length >= 10) this.sendLog()
            }
            break
        }
      } catch (error) {
        console.log('出错了')
      }
    },
    startTest () {
      this.vis.tip = false
      this.status = 'rec'
      this.$http
        .post('/userTests', { taskId: this.taskId })
    },
    sendLog () {
      const log = this.log
      this.log = []
      this.$http
        .patch('/userTests', { log: log, isCompleted: this.isCompleted })
    },
    leaveTest () {
      // window.close()
      this.$router.push({ name: 'Thanks' })
    },
    leave () 
  }
}
</script>

<style>

</style>
