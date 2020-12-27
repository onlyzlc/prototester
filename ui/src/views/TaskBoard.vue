<template>
  <div>
    <h1>测试任务报告</h1>
    <h2>{{ taskId }}</h2>
    <router-view />
  </div>
</template>

<script>
export default {
  props: ['taskId'],
  data () {
    return {

    }
  },
  created () {
    
  },
  methods: {
    store (taskNote) {
      this.pttUrl = taskNote.steps[0].url
      this.tip = taskNote.description
      this.stop = taskNote.steps[1]
    }
  }
}
</script>

<style>

</style>
