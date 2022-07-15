<template>
  <div>
    <!-- 弹框:测试引导 -->
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
    <!-- 弹框：自动判断用户完成已任务时的提示 -->
    <!-- <ln-dialog
      title="任务完成"
      :vis="isCompleted"
      @click-primary="NavToThk"
    >
      啊妹惊, 您完成了这个不可能的任务!!!
    </ln-dialog> -->
    <!-- 弹框：用户点击<已完成>后 -->
    <ln-dialog
      :vis="popup_researchRequest.vis"
      title=""
      btn-primary=""
      btn-secondary="离开"
      @click-secondary="NavToThk"
    >
      非常感谢，若不介意请再回答几个小问题以便我们更了解您刚才的感受。
    </ln-dialog>
    <!-- 弹框:用户点击<有困难>后 -->
    <ln-dialog
      :title="popup_difficulty.tittle"
      :vis="popup_difficulty.vis"
      btn-primary="提交"
      btn-secondary="取消"
      @click-primary="submitDifficulty"
      @click-secondary="popup_difficulty.vis = false"
    >
      <section>
        <p>
          <input
            id="difficulty1"
            v-model="difficulty"
            type="checkbox"
            value="不知道应该点哪"
          >
          <label for="difficulty1">
            不知道应该点哪
          </label>
        </p>
        <p>
          <input
            id="difficulty2"
            v-model="difficulty"
            type="checkbox"
            value="看不懂某些文字"
          >
          <label for="difficulty2">
            看不懂某些文字
          </label>
        </p>
      </section>
      <section>
        <label>其他:</label>
        <textarea
          id=""
          v-model="otherDifficulty"
          name=""
          cols="80"
          rows="5"
        />
      </section>
    </ln-dialog>
    <!-- 弹框：询问用户是否继续测试 -->
    <ln-dialog
      title="能否再试试?"
      :vis="popup_continue.vis"
      btn-primary="再试试"
      btn-secondary="离开"
      @click-primary="popup_continue.vis=false"
      @click-secondary="NavToThk"
    />
    <!-- 弹框:用户打开任务链接时，任务已下架的提示 -->
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
        <h4>目标: {{ taskNote.description }}</h4>
      </div>
      <div class="control">
        <button
          @click="clickDone"
        >
          已完成
        </button>
        <button @click="clickDiff">
          有困难
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
      mouseTrack: [],
      isCompleted: false,
      lostTime: 30000,
      unpublished: false,
      popup_start: {
        vis: false,
        tip: ''
      },
      popup_difficulty: {
        tittle: '',
        vis: false
      },
      popup_continue: {
        vis: false
      },
      popup_researchRequest: {
        vis: false
      },
      difficulty: [],
      otherDifficulty: ''
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
        if (content.url === this.stop.url &&
            content.type === this.stop.type &&
            content.target.id === this.stop.target.id &&
            content.target.nodeName.toLowerCase() === this.stop.target.nodeName &&
            content.target.innerText === this.stop.target.innerText &&
            content.target.value === this.stop.target.value) {
          this.isCompleted = true
        }
        this.log.push(content)
        // 暂存日志超过一定条数时上传到服务器
        if (this.log.length >= 5) {
          this.sendLog()
        }
      }
    },
    // 开始测试
    startTest () {
      this.popup_start.vis = false
      this.status = 'rec'
      this.timer = setTimeout(this.lost, this.lostTime)
      this.$http
        .post('/userTests', { taskId: this.taskId })
    },
    // 发送日志
    sendLog (thinkDone = false) {
      if (this.log.length === 0 && !thinkDone) return
      const log = this.log
      this.log = []
      this.$http
        .patch('/userTests', {
          log: log,
          isCompleted: this.isCompleted,
          thinkDone: thinkDone,
          mouseTrack: this.mouseTrack
        })
    },
    // 点击<有困难>
    clickDiff () {
      clearTimeout(this.timer)
      this.sendLog()
      this.popup_difficulty.tittle = '可否说说您现在的情况?'
      this.popup_difficulty.vis = true
    },
    // 点击<已完成>
    clickDone () {
      clearTimeout(this.timer)
      this.sendLog(true)
      this.popup_researchRequest.vis = true
      // todo: 问卷
      // this.NavToThk()
    },
    // 用户无动作
    lost () {
      // 如果超过一定时间没有动作, 则结束测试并显示反馈对话框
      this.sendLog()
      this.popup_difficulty.tittle = '您已经许久没有操作, 是否遇到了困难, 可否说说？'
      this.popup_difficulty.vis = true
    },
    // 提交困难
    submitDifficulty () {
      const d = this.difficulty
      if (this.otherDifficulty.trim()) d.push(this.otherDifficulty)
      this.$http
        .patch('/userTests', {
          difficulty: d
        })
        .then(() => {
          this.popup_difficulty.vis = false
          this.popup_continue.vis = true
        })
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
