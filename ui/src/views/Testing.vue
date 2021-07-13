<template>
  <div>
    <ln-dialog
      title="欢迎参与体验"
      :vis="popup_start.vis"
    >
      {{ taskNote.description || "" }}
      <template v-slot:foot-right>
        <button @click="startTest">
          开始
        </button>
      </template>
    </ln-dialog>
    <!-- <ln-dialog
      title="任务完成"
      :vis="isCompleted"
      @click-primary="NavToThk"
    >
      啊妹惊, 您完成了这个不可能的任务!!!
    </ln-dialog> -->
    <ln-dialog
      title="遇到困难了吗?"
      :vis="popup_lost.vis"
      btnPrimary="提交"
      btnSecondary="没什么,继续"
      @click-primary="feedback"
      @click-secondary="popup_lost.vis=false"
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
    <header>
      <div class="title">
        <div id="logo">
          Sodar
        </div>
        <h4>目标: {{taskNote.description}}</h4>
      </div>
      <div class="control">
        <button
          @click="NavToThk"
        >
          已完成
        </button>
        <button @click="popup_lost.vis = true">
          放弃
        </button>
      </div>
      <div class="info">
        <p>
          机器人正在记录您在下方网页中的操作
        </p>
      </div>
    </header>
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
            // this.store(res.data)
            this.taskNote = res.data
            this.popup_start.vis = true
            this.stop = this.taskNote.steps[1] || this.taskNote.steps[0]
            this.pttUrl = this.taskNote.steps[0].url
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
    processCmd (cmd, content) {
      if (cmd === 'post') {
        clearTimeout(this.timer)
        this.timer = setTimeout(this.lost, this.lostTime)
        // 判断是否触发最后一步,到达最后一步时自动结束测试;
        if (content.url === this.stop.url &&
            content.type === this.stop.type &&
            content.target.id === this.stop.target.id &&
            content.target.nodeName.toLowerCase() === this.stop.target.nodeName &&
            content.target.innerText === this.stop.target.innerText &&
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
      this.popup_lost.vis = true
    },
    feedback () {
      // todo: 提交反馈
      this.status = 'stop'
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
