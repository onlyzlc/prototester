<template>
  <div>
    <a
      target="view_window"
      :href="'/tasks/new?page=' + protoPage"
    >
      新增测试任务
    </a>
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
      pttHost: ['http://127.0.0.1:8082'],
      newTask: {
        name: '',
        description: ''
      }
    }
  },
  computed: {
    protoPage () {
      // if (window.parent) return window.parent.location.href
      // else
      return false
    }
  },
  watch: {
    $route: 'fetchData'
  },
  created () {
    // 查看能否在插件框架中
    window.addEventListener('message', this.reciveMsg, false)
    this.fetchData()
  },
  methods: {
    reciveMsg (e) {
      console.error('需要通过用户注册的原型地址实现来源限制, 当前来源:' + e.origin)
      // 需要通过用户注册的原型地址实现来源限制
      if (!this.pttHost.includes(e.origin)) {
        return false
      }
      console.log(e.data)
      e.source.postMessage('ready', e.origin)
    },
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
