<template>
  <div id="app">
    <dialog-ln  title="选择原型" :vv="vv1.visivility" @confirm="vv1.visivility=false" @cancel="vv1.visivility=false">
      <select multiple name="" id="">
        <option value="" v-for="(item, index) in ptts" :key="index">{{item}}</option>
      </select>
    </dialog-ln>
    <button v-on:click="vv1.visivility=true">新建任务</button>
  </div>
</template>

<script>
import DialogLn from './components/DialogLn.vue'

export default {
  name: 'App',
  data() {
    return {
      vv1:{
        visivility:false
      },
      ptts:['https://www.baidu.com/baidu?tn=monline_7_dg&ie=utf-8&wd=render%3A+h+%3D%3E+h%28App%29%2C','http://localhost:8081/tasks']
    }
  },
  components: {
    'dialog-ln':DialogLn
  },
  methods:{
  }
}

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
