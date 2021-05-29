<template>
  <div style="height:100%">
    <p>
      steps
      <router-link :to="{name: 'RecordSteps',params: {taskId: task.taskId}}">
        重新录制
      </router-link>
      <span
        :disabled="redoOrder.length==0"
        style=""
        class="textBtn"
        @click="redo"
      >撤销</span>
      <button
        v-if="redoOrder.length"
        @click="save"
      >
        保存
      </button>
    </p>
    <ul>
      <li
        v-for="(step, index) in task.steps"
        :key="index"
        class="step"
      >
        <template v-if="!step.deleted">
          <span class="des">
            {{ step.type }} [{{ step.target.nodeName }}]  {{ step.target.innerText || step.target.value }} at {{ step.timeStamp }}
          </span>
          <span
            class="delStep textBtn"
            @click="del(step)"
          >
            删除
          </span>
        </template>
      </li>
    </ul>
  </div>
</template>

<script>
// import LnDialog from '../components/Ln-Dialog.vue'
export default {
  components: {
  },
  data () {
    return {
      task: this.Store.state.task,
      steps: this.Store.state.task.steps,
      redoOrder: []
    }
  },
  methods: {
    del: function (step) {
      const i = this.steps.findIndex(item => item === step)
      // this.steps[i].deleted = true
      step.deleted = true
      this.redoOrder.push(i)
    },
    redo: function () {
      const i = this.redoOrder.pop()
      this.steps[i].deleted = false
    },
    save: function () {
      this.$http.patch('/tasks/' + this.taskId + '/steps', {
        steps: this.steps.filter(item => !item.deleted)
      }).then(res => {
        // todo 成功后跳转
        if (res.status === 201) {
          console.log('任务步骤更新成功，正在跳转回任务列表')
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
