<template>
  <div>
    <section>
      <label for="">任务名称</label>
      <p>{{ task.name }}</p>
      <label for="">任务描述</label>
      <p>{{ task.description }}</p>
      <label for="">步骤</label>
      <p>
        <router-link :to="{name: 'Steps'}">
          {{ task.steps.length }} 个步骤
        </router-link>
      </p>
      <label for="">测试报告</label>
      <p>
        共 {{ testings.length }} 次测试  |
        <span v-if="testings.length">{{ finished.length }} 次完成</span>
      </p>
    </section>
    <section v-if="testings.length > 0">
      <ul
        v-for="(t, index) in testings"
        :key="index"
      >
        <li>
          用户: {{ t.ip }} <span> {{ t.isCompleted ? "完成测试" : "没有完成测试" }} </span>
          <span v-if="t.isCompleted"> 耗时: {{ t.log[t.log.length - 1].timeStamp - t.log[0].timeStamp }} ms</span>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
export default {
  data () {
    return {
      task: this.Store.state.task,
      testings: []
    }
  },
  computed: {
    finished: function () {
      return this.testings.filter(item => item.isCompleted)
    }
  },
  beforeCreate () {
    console.log('Task board 前')
  },
  created () {
    this.fetchTesting()
    console.log('已创建 Task board')
  },
  methods: {
    fetchTesting: function () {
      this.$http
        .get(`tasks/${this.task.taskId}/testReport`)
        .then(result => { this.testings = result.data.slice() })
    }
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
