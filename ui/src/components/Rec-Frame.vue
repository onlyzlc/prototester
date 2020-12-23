<template>
  <iframe
    :src="url"
    frameborder="0"
    style="width: 100%; height: 100%"
  />
</template>

<script>
export default {
  name: 'RecFrame',
  props: {
    url: {
      type: String,
      default: ''
    },
    state: {
      type: String,
      default: 'init'
    }
  },
  computed: {
    frame: () => document.querySelector('iframe')
  },
  watch: {
    state: function (val) {
      this.send(val)
      this.state = val
    }
  },
  methods: {
    send: function (msg) {
      this.frame.contentWindow.postMessage({
        cmd: msg
      }, this.url)
    }
  }
}
</script>

<style>
</style>
