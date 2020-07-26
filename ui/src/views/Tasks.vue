<template>
  <div>这里会有个测试任务列表</div>
</template>

<script>
export default {
  created () {
    this.fetchData()
  },
  watch: {
    $route: 'fetchData'
  },
  methods: {
    fetchData: function () {
      this.$http.get('tasks')
        .then(res => {
          console.log(res.data)
        })
    }
  }
}
</script>

<style>

</style>
