<template>
  <div style="height:100%">
    <!-- 工具栏 -->
    <header>
      <div class="title">
        <div id="logo">
          Sodar
        </div>
        <h4>录制任务步骤</h4>
      </div>
      <div class="control">
        <button
          v-if="status=='init'"
          @click="status='rec'"
        >
          开始记录
        </button>
        <div v-if="status=='rec'">
          <span>{{ steps.length }}</span>
          <button
            :disabled="steps.length == 0"
            @click="save"
          >
            结束并保存
          </button>
        </div>
        <button @click="close">
          取消
        </button>
      </div>
      <div class="info">
        <p v-show="status=='rec'">
          已记录 {{ steps.length }} 个步骤
        </p>
      </div>
    </header>
    <div class="recpanel">
      <rec-frame
        :url="pttUrl"
        :status="status"
      />
    </div>
    <ln-dialog
      title="保存成功"
      :vis="vis.dia_finished"
    >
      <template v-slot:foot-right>
        <button @click="close">
          关闭
        </button>
      </template>
    </ln-dialog>
  </div>
</template>

<script>
// import LnPopconfirm from '../components/Ln-Popconfirm.vue'
import LnDialog from '../components/Ln-Dialog'
import RecFrame from '../components/Rec-Frame.vue'
export default {
  components: {
    // LnPopconfirm,
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
    close: function () {
      // window.close()
      // this.$route.push('')
      // 关闭当前窗口
      self.opener = null
      self.close()
    }
  }
}
</script>

<style>
html,body,#app{
  height: 100%
}
header{
  background-color: antiquewhite;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.title>*{
  display: inline-block;
  padding: 0;
  margin: 0;
}
#logo{
  background-image: url();
  width: 54px;
  height: 20px;
  font-weight: 700;
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
