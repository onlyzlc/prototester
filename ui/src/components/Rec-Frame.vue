<template>
  <load-panel :status="maskStatus">
    <iframe
      :src="url"
      frameborder="0"
      style="width: 100%; height: 100%"
    />
  </load-panel>
</template>

<script>
import LoadPanel from './Load-Panel'
export default {
  name: 'RecFrame',
  components: {
    LoadPanel
  },
  props: {
    url: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      default: 'init'
    }
  },
  computed: {
    frame: () => document.querySelector('iframe'),
    maskStatus: function () {
      if (this.url === '' || this.status === 'init') return 'loading'
      else if (this.status === 'disabled') return 'disabled'
      else return ''
    }
  },
  watch: {
    status: function (val) {
      this.send(val)
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
