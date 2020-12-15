<template>
  <div style="height:100%">
    <!-- 工具栏 -->
    <div class="controlbar">
      <button
        v-if="state=='init'"
        @click="startrec()"
      >
        开始记录
      </button>
      <div v-else-if="state=='rec'">
        <span>{{ steps.length }}</span>
        <button
          @click="finish()"
        >
          完成
        </button>
      </div>
      <div v-else-if="state=='finished'">
        <button @click="vis.saveConfirem = true">
          保存
        </button>
        <button>
          取消
        </button>
      </div>
    </div>
    <div class="recpanel">
      <div class="left">
        <iframe
          :src="pttUrl"
          frameborder="0"
          style="width: 100%; height: 100%"
        />
      </div>
      <div
        v-if="state=='finished'"
        class="right"
      >
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
            v-for="step in steps"
            :key="step.timeStamp"
            class="step"
          >
            <template v-if="!step.isDel">
              <span class="des">
                {{ step.type }} [{{ step.nodeName }}]  {{ step.innerText || step.value }} at {{ step.timeStamp }}
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
    </div>
    <LnDialog
      title="保存任务"
      :vis="vis.saveConfirem"
      @click_primary="save"
      @click_secondary="vis.saveConfirem = false"
    >
      <form
        id="newTask"
        @submit.prevent="save"
      >
        <div>
          <label for="taskName">任务名称:</label>
          <input
            v-model="name"
            type="text"
            required
          >
        </div>
        <div>
          <label for="taskDes">任务描述:</label>
          <textarea
            id="taskDes"
            v-model="description"
            required
            name="taskDes"
            cols="30"
            rows="5"
          />
        </div>
      </form>
      <template v-slot:foot-right>
        <button
          form="newTask"
          class="primary"
          type="submit"
        >
          提交
        </button>
        <button
          class="secondary"
          @click="vis.saveConfirem=false"
        >
          取消
        </button>
      </template>
    </LnDialog>
  </div>
</template>

<script>
import LnDialog from '../components/Ln-Dialog.vue'
export default {
  components: {
    LnDialog
  },
  data () {
    return {
      state: 'init',
      pttHost: ['http://127.0.0.1:8082'],
      pttUrl: this.Store.state.pttUrl,
      origin: '',
      steps: [],
      redoOrder: [],
      name: '',
      description: '',
      vis: {
        saveConfirem: false
      }
    }
  },
  computed: {
    frame: () => document.querySelector('iframe')
  },
  created () {
    window.addEventListener('message', (e) => {
      console.info('需要通过用户注册的原型地址实现来源限制, 当前来源:' + e.origin)
      // 需要通过用户注册的原型地址实现来源限制
      if (!this.pttHost.includes(e.origin)) {
        return false
      }
      this.origin = e.origin
      console.log(e.data)
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
            content.isDel = false
            this.steps.push(content)
        }
      } catch (error) {
        console.log('出错了')
      }
    })
  },
  methods: {
    send: function (msg) {
      this.frame.contentWindow.postMessage({
        cmd: msg
      }, this.origin)
    },
    startrec: function () {
      this.send('rec')
      this.state = 'rec'
    },
    finish: function () {
      this.send('stop')
      this.state = 'finished'
    },
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
        name: this.name,
        description: this.description,
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
