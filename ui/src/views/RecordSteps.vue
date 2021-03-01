<template>
  <div style="height:100%">
    <!-- 工具栏 -->
    <div class="controlbar">
      <!-- <button
        v-if="status=='init'"
        @click="status='rec'"
      >
        开始记录
      </button> -->
      <div v-if="status=='rec'">
        <span>{{ steps.length }}</span>
        <button
          @click="save"
        >
          结束并保存
        </button>
        <button>
          取消
        </button>
      </div>
    </div>
    <div class="recpanel">
      <rec-frame
        :url="pttUrl"
        :status="status"
      />
    </div>
    <ln-dialog
      title="开始录制"
      :vis="status=='init'"
    >
      <p>
        开始录制的提示
      </p>
      <template v-slot:foot-right>
        <button
          type="button"
          @click="status='rec'"
        >
          开始录制
        </button>
      </template>
    </ln-dialog>
    <ln-dialog
      title="保存成功"
      :vis="vis.dia_finished"
    >
      <template v-slot:foot-right>
        <button @click="leave">
          离开
        </button>
      </template>
    </ln-dialog>
  </div>
</template>

<script>
import LnDialog from '../components/Ln-Dialog.vue'
import RecFrame from '../components/Rec-Frame.vue'
export default {
  components: {
    LnDialog,
    RecFrame
  },
  props: ['taskId'],
  data () {
    return {
      status: 'init',
      pttHost: ['http://127.0.0.1:8082'],
      pttUrl: this.Store.state.pttUrl,
      origin: '',
      steps: [],
      saveSuccess: false,
      vis: {
        dia_start: true,
        dia_finished: false
      }
    }
  },
  created () {
    window.addEventListener('message', (e) => {
      console.info('需要通过用户注册的原型地址实现来源限制, 当前来源:' + e.origin)
      // 需要通过用户注册的原型地址实现来源限制
      if (!this.pttHost.includes(e.origin)) {
        return false
      }
      // this.origin = e.origin
      console.log('收到 %s 消息: %o', e.origin, e.data)
      try {
        const { cmd, content } = e.data
        switch (cmd) {
          case 'init':
            e.source.postMessage({
              cmd: 'ready'
            }, e.origin)
            break
          case 'post':
            // 接收保存新新动作
            this.steps.push(content)
        }
      } catch (error) {
        console.log('出错了')
      }
    })
  },
  methods: {
    save: function () {
      this.status = 'stop'
      this.$http.patch('/tasks/' + this.taskId + '/steps', {
        steps: this.steps
      }).then(res => {
        // todo 成功后跳转
        if (res.status === 201) {
          console.log('任务步骤更新成功，正在跳转回任务列表')
          this.vis.dia_finished = true
        }
      })
    },
    leave: function () {
      // window.close()
      this.$route.push('')
    }
  }
}
</script>

<style>
html,body,#app{
  height: 100%
}
.controlbar{
  background-color: antiquewhite;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.recpanel{
  display: flex;
  height: calc(100% - 40px);
}
.recpanel .left{
  flex: 1;
}
.recpanel .right{
  font-size: 0.8em;
  width: 400px;
  border-left: 1px solid red;
}
.recpanel .right ul{
  padding: 0 10px
}
.step{
  display: flex;
}
.step .des{
  flex: 1
}
.textBtn{
  color: red;
}
.textBtn:hover{
  cursor: pointer;
}
.textBtn[disabled]{
  cursor: default;
  color: gray
}
</style>
