<template>
  <div>
    <ln-dialog
      title="欢迎参与体验"
      :vis="popup_start.vis"
    >
      {{ popup_start.tip }}
      <template v-slot:foot-right>
        <button @click="startTest">
          开始
        </button>
      </template>
    </ln-dialog>
    <ln-dialog
      title="任务完成"
      :vis="isCompleted"
      @click-primary="NavToThk"
    >
      啊妹惊, 您完成了这个不可能的任务!!!
    </ln-dialog>
    <ln-dialog
      :vis="unpublished"
      title="任务已下架"
    >
      感谢参与
      <template v-slot:foot-right>
        <div />
      </template>
    </ln-dialog>
    <rec-frame
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
      unpublished: false,
      popup_start: {
        vis: false,
        tip: ''
      }
    }
  },
  created () {
    window.addEventListener('message', this.reciveMsg, false)
    // 获取当前任务ID
    // 获取任务数据
    this.$http
      .get(`/tasks/${this.taskId}/taskNote`)
      .then((res) => {
        switch (res.status) {
          case 200:
            this.store(res.data)
            break
          case 204:
            // 任务未发布
            this.unpublished = true
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
      this.popup_start.tip = taskNote.description
      this.popup_start.vis = true
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
            // 判断是否触发最后一步,到达最后一步时自动结束测试;
            if (content.type === this.stop.type &&
                content.target.id === this.stop.target.id &&
                content.target.nodeName.toLowerCase() === this.stop.target.nodeName &&
                content.target.value === this.stop.target.value) {
              this.isCompleted = true
              this.log.push(content)
              this.sendLog()
              this.status = 'stop'
            } else {
              // 未到达最后一步时
              this.log.push(content)
              // 暂存日志超过一定条数时上传到服务器
              if (this.log.length >= 5) {
                this.sendLog()
              }
            }
            break
        }
      } catch (error) {
        console.log('出错了: %o', error)
      }
    },
    startTest () {
      this.popup_start.vis = false
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
    NavToThk () {
      // window.close()
      this.$router.push({ name: 'Thanks' })
    }
  }
}
</script>

<style>

</style>
