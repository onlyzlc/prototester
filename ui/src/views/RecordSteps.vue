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
          v-if="status=='ready'"
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
        @reciveCmd="processCmd"
      />
    </div>
    <ln-dialog
      title="保存成功"
      :vis="vis.dia_finished"
    >
      <template v-slot:foot-right>
        <button @click="close">
          返回
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
      pttUrl: '',
      steps: [],
      saveSuccess: false,
      vis: {
        dia_finished: false
      }
    }
  },
  created () {
    this.$http.get('/tasks/' + this.taskId + '/pttUrl')
      .then(result => { this.pttUrl = result.data })
    // window.addEventListener('message', this.reciveMsg)
  },
  methods: {
    processCmd: function (cmd, content) {
      switch (cmd) {
        case 'init':
          if (this.status === 'rec') return
          this.status = 'ready'
          break
        case 'post':
          // 接收保存新新动作
          content.deleted = false
          this.steps.push(content)
      }
    },
    // reciveMsg: function (e) {
    //   // console.info('需要通过用户注册的原型地址实现来源限制, 当前来源:' + e.origin)
    //   // 需要通过用户注册的原型地址实现来源限制
    //   if (!this.pttHost.includes(e.origin)) {
    //     return false
    //   }
    //   console.log('收到%s的消息: %o', e.origin, e.data)
    //   try {
    //     const { cmd, content } = e.data
    //     switch (cmd) {
    //       case 'init':
    //         if (this.status === 'rec') return
    //         this.status = 'ready'
    //         break
    //       case 'post':
    //         // 接收保存新新动作
    //         this.steps.push(content)
    //     }
    //   } catch (error) {
    //     console.log('出错了')
    //   }
    // },
    save: function () {
      this.status = 'stop'
      this.$http.patch('/tasks/' + this.taskId + '/steps', {
        steps: this.steps
      }).then(result => {
        // todo 成功后跳转
        if (result.status === 201) {
          console.log('任务步骤更新成功，正在跳转回任务列表')
          this.vis.dia_finished = true
        }
      })
    },
    close: function () {
      this.$router.push({ name: 'Steps', params: { taskId: this.taskId } })
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
