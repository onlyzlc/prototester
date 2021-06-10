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
        v-for="(step, index) in task.steps"
        :key="index"
        class="step"
        :class="{ deleted: dels.includes(index) }"
      >
        <span class="des">
          {{ step.type }} [{{ step.target.nodeName }}]  {{ step.target.innerText || step.target.value }} at {{ step.timeStamp }}
        </span>
        <span
          v-if="!dels.includes(index)"
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
      stepsCopy: [],
      dels: []
    }
  },
  methods: {
    del: function (num) {
      this.dels.push(num)
    },
    restore: function (num) {
      this.dels.splice(this.dels.indexOf(num), 1)
    },
    save: function () {
      for (const num of this.dels) {
        this.task.steps.splice(num, 1)
      }
      this.$http.patch('/tasks/' + this.taskId + '/steps', {
        steps: this.task.steps
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
.deleted .des{
  text-decoration: line-through;
}
</style>
