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
    <div>
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
      pttUrl: '',
      name: '',
      description: ''
    }
  },
  created () {
    if (this.Store.taskState.pttUrl) {
      this.pttUrl = this.Store.taskState.pttUrl
    }
  },
  methods: {
    save: function () {
      this.Store.update({
        url: this.pttUrl
      }, 'ptt')
      this.$http
        .post('/tasks', {
          name: this.name,
          description: this.description,
          pttUrl: this.pttUrl
        })
        .then((res) => {
          // todo 成功后跳转
          if (res.status === 201) {
            console.log('任务创建成功，正在跳转步骤录制页面')
            window.open(`/recordsteps/${res.data}`)
            this.$router.back()
          }
        })
    },
    cancel: function () {}
  }
}
</script>
