<template>
  <div>
    <button @click="$router.push({ name: 'CreateTask' })">
      新增测试任务
    </button>
    <ul>
      <li
        v-for="(task, index) in tasks"
        :key="task.taskId"
      >
        <a :href="'/tasks/'+task.taskId">{{ task.name }}</a> |
        <span class="status">{{ (task.status=="unpublished")?("已撤下"):("已发布") }}</span> |
        <a :href="'/tasks/'+task.taskId+'/setting'">设置步骤</a> |
        <a :href="'/tasks/'+task.taskId+'/testing'">开始测试</a> |
        <button
          class="publish"
          @click="publish(index)"
        >
          {{ (task.status=="unpublished")?("发布"):("撤下") }}
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tasks: [],
      newTask: {
        name: '',
        description: ''
      }
    }
  },
  watch: {
    $route: 'fetchData'
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.$http
        .get('/tasks')
        .then(res => {
          if (Array.isArray(res.data)) {
            this.tasks = res.data
          } else if (this.Store.debug) console.error('数据传输类型错误')
        })
        .catch(err => console.error(err))
    },
    publish (index) {
      const thisTask = this.tasks[index]
      const newStatus =
        thisTask.status === 'published' ? 'unpublished' : 'published'
      this.$http
        .patch('/tasks/' + thisTask.taskId + '/status', { status: newStatus })
        .then(() => {
          thisTask.status = newStatus
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
</style>
