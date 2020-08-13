<template>
  <div>
    <ul>

    </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tasks: []
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
      this.$http.get('/tasks')
        .then(res => {
          if (Array.isArray(res.data)) {
            this.tasks = res.data
          } else if (this.Store.debug) console.error('数据传输类型错误')
        })
        .catch(console.error('数据传输错误'))
    }

  }
}
</script>

<style>

</style>
