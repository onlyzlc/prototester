<template>
  <div>
    <section>
      <label for="">任务名称</label>
      <p>{{ task.name }}</p>
      <label for="">任务描述</label>
      <p>{{ task.description }}</p>
      <label for="">步骤</label>
      <router-link :to="{name: 'Steps'}">
        {{ task.steps.length }} 个步骤
      </router-link>
    </section>
    <section>
      <ul v-for="t in task.testing" :key="t.ip">
        <li></li>
      </ul>
    </section>
  </div>
</template>

<script>
export default {
  data () {
    return {
      task: this.Store.state.task
    }
  },
  beforeCreate () {
    console.log('Task board 前')
  },
  created () {
    console.log('已创建 Task board')
  },
  methods: {
  }
}
</script>

<style>
html,body,#app{
  height: 100%
}
.controlbar{
  background-color: antiquewhite;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.recpanel{
  display: flex;
  height: calc(100% - 40px);
}
.recpanel .left{
  flex: 1;
}
.recpanel .right{
  font-size: 0.8em;
  width: 400px;
  border-left: 1px solid red;
}
.recpanel .right ul{
  padding: 0 10px
}
.step{
  display: flex;
}
.step .des{
  flex: 1
}
.textBtn{
  color: red;
}
.textBtn:hover{
  cursor: pointer;
}
.textBtn[disabled]{
  cursor: default;
  color: gray
}
</style>
