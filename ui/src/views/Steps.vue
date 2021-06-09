<template>
  <div style="height:100%">
    <p>
      steps
      <router-link :to="{name: 'RecordSteps',params: {taskId: task.taskId}}">
        重新录制
      </router-link>
      <button
        @click="save"
      >
        保存
      </button>
    </p>
    <ul>
      <li
        v-for="(step, index) in stepsCopy"
        :key="index"
        class="step"
        :class="{ deleted:step.deleted }"
      >
        <span class="des">
          {{ step.type }} [{{ step.target.nodeName }}]  {{ step.target.innerText || step.target.value }} at {{ step.timeStamp }}
        </span>
        <span
          v-if="!step.deleted"
          class="delStep textBtn"
          @click="del(index)"
        >
          删除
        </span>
        <span
          v-else
          class="delStep textBtn"
          @click="restore(index)"
        >
          撤销
        </span>
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
      stepsCopy: []
    }
  },
  created () {
    this.stepsCopy = this.task.steps.map(item => {
      item.deleted = false
      return item
    })
  },
  methods: {
    del: function (i) {
      // const i = this.steps.findIndex(item => item === step)
      // this.steps[i].deleted = true
      this.stepsCopy[i].deleted = true
      // this.redoOrder.push(step)
    },
    restore: function (i) {
      // const i = this.redoOrder.pop()
      this.stepsCopy[i].deleted = false
    },
    save: function () {
      this.$http.patch('/tasks/' + this.taskId + '/steps', {
        steps: this.stepsCopy.filter(item => !item.deleted)
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
.deleted{
  text-decoration: line-through;
}
</style>
