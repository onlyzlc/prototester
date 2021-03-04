<template>
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
    <!-- 获取不到原型地址时(此时可能是单独打开了任务管理页面), 显示地址输入框 -->
    <div v-show="manually">
      <label for="pttUrl">原型地址:</label>
      <input
        v-model="pttUrl"
        type="text"
        required
      >
    </div>
    <button
      form="newTask"
      class="primary"
      type="submit"
    >
      创建
    </button>
    <button
      class="secondary"
      @click.prevent="$router.back()"
    >
      取消
    </button>
  </form>
</template>
<script>
export default {
  data () {
    return {
      pttHost: ['http://127.0.0.1:8082'],
      pttUrl: this.Store.state.pttUrl,
      name: '',
      description: '',
      manually: false
    }
  },
  mounted () {
    // 获取不到原型地址时(此时可能是单独打开了任务管理页面), 显示地址输入框
    if (this.pttUrl === '') {
      this.manually = true
      this.pttUrl = ''
    }
  },
  methods: {
    save: function () {
      this.Store.update({
        pttUrl: this.pttUrl
      })
      this.$http
        .post('/tasks', {
          name: this.name,
          description: this.description
        })
        .then((res) => {
          // todo 成功后跳转
          if (res.status === 201) {
            console.log('任务创建成功，正在跳转步骤录制页面')
            window.open(`/tasks/${res.data}/recordsteps`)
            this.$router.back()
          }
        })
    },
    cancel: function () {}
  }
}
</script>
