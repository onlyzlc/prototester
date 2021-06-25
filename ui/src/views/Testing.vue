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
      title="不知如何继续了吗?"
      :vis="popup_lost.vis"
      btnPrimary="提交"
      @click-primary="feedback"
    >
      <p>请说出您的疑惑:</p>
      <textarea name="" id="" cols="80" rows="5"></textarea>
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
    <ptt-frame
      :url="pttUrl"
      :status="status"
      :msg="msg"
      @reciveCmd="processCmd"
    />
  </div>
</template>

<script>
import LnDialog from '../components/Ln-Dialog.vue'
import PttFrame from '../components/Ptt-Frame.vue'
export default {
  components: {
    PttFrame,
    LnDialog
  },
  data () {
    return {
      taskId: this.$route.params.taskId,
      taskNote: {},
      pttHost: ['http://127.0.0.1:8082'],
      status: 'ready',
      msg: {},
      pttUrl: '',
      tip: '',
      stop: {},
      log: [],
      isCompleted: false,
      lostTime: 30000,
      unpublished: false,
      popup_start: {
        vis: false,
        tip: ''
      },
      popup_lost: {
        vis: false
      }
    }
  },
  created () {
    // window.addEventListener('message', this.reciveMsg, false)
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
      this.stop = taskNote.steps[1] || taskNote.steps[0]
    },
    processCmd (cmd, content) {
      if (cmd === 'post') {
        clearTimeout(this.timer)
        this.timer = setTimeout(this.lost, this.lostTime)
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
      }
    },
    startTest () {
      this.popup_start.vis = false
      this.status = 'rec'
      this.timer = setTimeout(this.lost, this.lostTime)
      this.$http
        .post('/userTests', { taskId: this.taskId })
    },
    sendLog () {
      const log = this.log
      this.log = []
      this.$http
        .patch('/userTests', { log: log, isCompleted: this.isCompleted })
    },
    lost () {
      // 如果超过一定时间没有动作, 则结束测试并显示反馈对话框
      if (this.log.length) this.sendLog()
      this.status = 'stop'
      this.popup_lost.vis = true
    },
    feedback () {
      // todo: 提交反馈
      this.NavToThk()
    },
    NavToThk () {
      // window.close()
      this.$router.replace({ name: 'Thanks' })
    }
  }
}
</script>

<style>

</style>
