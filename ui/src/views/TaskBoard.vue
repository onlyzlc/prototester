<template>
  <div>
    <h1>测试任务报告</h1>
    <h2>{{ taskId }}</h2>
  </div>
</template>

<script>
export default {
  data () {
    return {
      taskId: this.$route.parmas.taskId
    }
  },
  created () {
    this.$http
      .get(`/tasks/${this.taskId}`)
      .then(res => (this.store(res.data)))
  }
}
</script>

<style>

</style>
