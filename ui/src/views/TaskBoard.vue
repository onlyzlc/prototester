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
    <section>
      <ul
        v-for="(t) in testings"
        :key="t._id"
      >
        <li>
          <ln-folder>
            <template
              v-slot:
              label
            >
              用户: {{ t.ip }}
              <span>自认为{{ t.thinkDone ? "完成任务" : "没有完成任务" }} </span>,
              <span>实际{{ t.isCompleted ? "完成任务" : "没有完成任务" }} </span>
            </template>
            <template
              v-slot:
              panel
            >
              <span v-if="t.isCompleted"> 耗时: {{ t.log[t.log.length - 1].timeStamp - t.log[0].timeStamp }} ms</span>
              <template v-if="t.difficulty.length">
                <ul
                  v-for="(point, index) in t.difficulty"
                  :key="index"
                >
                  <li>{{ point }}</li>
                </ul>
              </template>
            </template>
          </ln-folder>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
import LnFolder from '../components/Ln-Folder.vue'
export default {
  components: { LnFolder },
  props: {
    taskId: String
  },
  data () {
    return {
      task: this.Store.state.task,
      testings: [{
        difficulty: [],
        ip: '10.10.10.1',
        isCompleted: false,
        log: [],
        mouseTrack: [],
        task: '',
        thinkDone: true
      }]
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
        .get(`tasks/${this.taskId}/testReport`)
        .then(result => {
          // this.testings = result.data.slice()
          result.data.forEach(testing => {
            this.testings.push(testing)
          })
        })
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
