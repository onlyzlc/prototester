<template>
  <div style="height:100%">
    <!-- 工具栏 -->
    <div class="controlbar">
      <button
        v-if="status=='init'"
        @click="status='rec'"
      >
        开始记录
      </button>
      <div v-else-if="status=='rec'">
        <span>{{ steps.length }}</span>
        <button
          @click="status='stop'"
        >
          完成
        </button>
      </div>
      <div v-else-if="status=='stop'">
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
        <!-- <iframe
          :src="pttUrl"
          frameborder="0"
          style="width: 100%; height: 100%"
        /> -->
        <rec-frame
          :url="pttUrl"
          :status="status"
        />
      </div>
      <div
        v-if="status=='stop'"
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
                {{ step.type }} [{{ step.target.nodeName }}]  {{ step.target.innerText || step.target.value }} at {{ step.timeStamp }}
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
  </div>
</template>

<script>
// import LnDialog from '../components/Ln-Dialog.vue'
import RecFrame from '../components/Rec-Frame.vue'
export default {
  components: {
    RecFrame
  },
  data () {
    return {
      status: 'init',
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
            content.isDel = false
            this.steps.push(content)
        }
      } catch (error) {
        console.log('出错了')
      }
    })
  },
  methods: {
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

</style>
