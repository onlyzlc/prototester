<template>
  <div class="container">
    <div class="left">
      <rec-frame
        :url="pttUrl"
        :status="status"
      />
    </div>
    <div class="right">
      <router-view />
    </div>
  </div>
</template>

<script>
import RecFrame from '../components/Rec-Frame.vue'
export default {
  components: {
    RecFrame
  },
  props: ['taskId'],
  data () {
    return {
      pttUrl: '',
      status: 'init'
    }
  },
  created () {},
  methods: {
  }
}
</script>

<style>
html,
body,
#app {
  height: 100%;
}
.controlbar {
  background-color: antiquewhite;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.container {
  display: flex;
  height: calc(100% - 40px);
}
.left {
  flex: 1;
}
.right {
  font-size: 0.8em;
  width: 400px;
  border-left: 1px solid red;
}
.right ul {
  padding: 0 10px;
}
.step {
  display: flex;
}
.step .des {
  flex: 1;
}
.textBtn {
  color: red;
}
.textBtn:hover {
  cursor: pointer;
}
.textBtn[disabled] {
  cursor: default;
  color: gray;
}
</style>
