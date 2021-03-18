<template>
  <div>
    <router-link :to="{name: 'NewTask'}">
      新增测试任务
    </router-link>
    <load-panel :status="status_taskData">
      <ul>
        <template v-for="(task, index) in tasks">
          <li
            v-if="!task.deleted"
            :key="task.taskId"
          >
            <a
              :href="'/tasks/' + task.taskId"
              target="_blank"
            >
              {{ task.name }}
            </a> |
            <!-- <a :href="'/tasks/'+task.taskId">{{ task.name }}</a> | -->
            <span class="status">{{ (task.status=="unpublished")?("已撤下"):("已发布") }}</span> |
            <a
              :href="'/tasks/'+task.taskId+'/recordsteps'"
              target="_blank"
            >设置步骤</a> |
            <a
              :href="'/testing/'+ task.taskId "
              target="_blank"
            >开始测试</a> |
            <button
              class="publish"
              @click="publish(index)"
            >
              {{ (task.status=="unpublished")?("发布"):("撤下") }}
            </button>
            <button
              class="del"
              @click="delTask(task.taskId)"
            >
              删除
            </button>
          </li>
        </template>
      </ul>
    </load-panel>
  </div>
</template>

<script>
import LoadPanel from '../components/Load-Panel'
export default {
  components: {
    LoadPanel
  },
  data () {
    return {
      tasks: [],
      status_taskData: 'loading',
      pttHost: ['http://127.0.0.1:8082'],
      curPage: '',
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
      console.info('需要通过用户注册的原型地址实现来源限制, 当前来源:' + e.origin)
      // 需要通过用户注册的原型地址实现来源限制
      if (!this.pttHost.includes(e.origin)) {
        return false
      }
      console.log(e.data)
      try {
        // const [cmd, content] = e.data.split('?')
        const { cmd, content } = e.data
        switch (cmd) {
          case 'init': {
            // 获取原型页面链接
            e.source.postMessage({
              cmd: 'href'
            }, e.origin)
            // e.source.postMessage('href', e.origin)
            break
          }
          case 'href': {
            this.curPage = content
            this.Store.update({ pttUrl: content })
            break
          }
        }
      } catch (error) {
        console.log('出错了')
      }
    },
    fetchData () {
      this.status_taskData = 'loading'
      this.$http
        .get('/tasks')
        .then(res => {
          if (Array.isArray(res.data)) {
            this.status_taskData = res.data.length ? '' : 'empty'
            this.tasks = res.data
          } else if (this.Store.debug) {
            this.status_taskData = 'error'
            console.error('数据错误')
          }
        })
        .catch(err => {
          console.error(err)
          this.status_taskData = 'error'
        })
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
    },
    delTask (taskId) {
      const n = this.tasks.findIndex(item => item.taskId === taskId)
      this.tasks[n].deleted = true
      this.$http
        .delete(`/tasks/${taskId}`)
        .then(res => {
          if (res.status === 200) {
            console.log('删除成功' + taskId)
          }
        })
    }
  }
}
</script>

<style>
</style>
