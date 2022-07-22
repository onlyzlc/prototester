<template>
  <div :class="layout" class="container">
    <section style="flex: none;" class="sidebar">
      <router-link :to="{ name: 'Tasks'}">
        测试任务
      </router-link>
      /
      <router-link :to="{ name: 'TaskBoard'}">
        {{ task.name }}
      </router-link>
      <span class="status">{{ (task.status=="unpublished")?("已撤下"):("已发布") }}</span>
      <router-link
        v-if="task.status=='published'"
        :to="{ name: 'Testing', params: { taskId: taskId }}"
        target="_blank"
      >
        开始测试
      </router-link>
      <button
        class="publish"
        @click="publish"
      >
        {{ (task.status=="unpublished")?("发布"):("撤下") }}
      </button>
    </section>
    <section  style="flex: auto;">
      <ptt-frame
        :url="pttUrl"
        :status="status"
        @reciveCmd="processCmd"
      />
    </section>
    <section  style="flex: none;"  class="sidebar">
      <router-view />
    </section>
  </div>
</template>

<script>
import PttFrame from '../components/Ptt-Frame.vue'
export default {
  components: {
    PttFrame
  },
  props: ['taskId'],
  data () {
    return {
      task: this.Store.state.task,
      // pttHost: ['http://127.0.0.1:8082'],
      pttUrl: '',
      status: 'disabled',
      layout: 'vertical'
    }
  },
  created () {
    console.log('task已创建')
    this.fetchTask()
  },
  methods: {
    processCmd: function (cmd, content) {
    },
    fetchTask (next) {
      // 获取数据
      this.$http
        .get(`/tasks/${this.taskId}`)
        .then((result, vm = this) => {
          const task = result.data
          vm.Store.update('task', task)
          this.pttUrl = (task.steps.length) ? task.steps[0].url : task.ptt.url
        })
      if (next) next()
    },
    publish () {
      const newStatus =
        this.task.status === 'published' ? 'unpublished' : 'published'
      this.$http
        .patch('/tasks/' + this.task.taskId + '/status', { status: newStatus })
        .then(() => {
          // this.task.status = newStatus
          this.Store.update('task', { status: newStatus })
        })
        .catch(function (error) {
          // handle error
          console.log(error)
        })
    }
  }
}
</script>

<style>
html,
body,
#app {
  height: 100%;
}
.controlbar {
  background-color: antiquewhite;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.container {
  display: flex;
  height: 100%;
  flex-flow: column nowrap;
}
.container.vertical{
  /* display: flex; */
}
.sidebar{
  background-color: #f2f2f2;
}
.right ul {
  padding: 0 10px;
}
.step {
  display: flex;
}
.step .des {
  flex: 1;
}
.textBtn {
  color: red;
}
.textBtn:hover {
  cursor: pointer;
}
.textBtn[disabled] {
  cursor: default;
  color: gray;
}
</style>
