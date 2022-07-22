<template>
  <div style="display:flex;flex-flow:row nowrap">
    <section style="flex:none">
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
        共 {{ task.testings.length }} 次测试  |
        <span v-if="task.testings.length">{{ finished.length }} 次完成</span>
      </p>
    </section>
    <section  class="timeline"  style="flex:auto">
      <div class="axis">
        <ul>
          <li
          ></li>
        </ul>
      </div>
      <ul>
        <li
          v-for="(test) in task.testings"
          :key="test._id"
           class="row"
        >
            <div
              class="eventFlag"
              v-for = "(action,index) in test.log"
              :key = "action._id"
              v-bind:style="{left: ((action.timeStamp-test.log[0].timeStamp)*pxPreMS) +'px' }"
              >
                <span>
                  {{index}}
                </span>
          </div>
          <!-- <ln-folder>
            <template
              v-slot:label
            >
              用户: {{ t.ip }}
              <span>自认为{{ t.thinkDone ? "完成任务" : "没有完成任务" }} </span>,
              <span>实际{{ t.isCompleted ? "完成任务" : "没有完成任务" }} </span>
            </template>
            <template
              v-slot:dropDownBox
            >
              <span v-if="t.isCompleted"> 耗时: {{ t.log[t.log.length - 1].timeStamp - t.log[0].timeStamp }} ms</span>
              <ul>
                <li
                  v-for="(point, index) in t.difficulty"
                  :key="index"
                >
                  {{ point }}
                </li>
              </ul>
            </template>
          </ln-folder> -->
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
// import LnFolder from '../components/Ln-Folder.vue'
export default {
  // components: { LnFolder },
  props: {
  },
  data () {
    return {
      task: this.Store.state.task,
      // 每像素等价多少秒
      pxPreMS: 0.1
    }
  },
  computed: {
    testings: function () { return this.task.testings },
    finished: function () {
      return this.task.testings.filter(item => item.isCompleted)
    }
  },
  created () {
    console.log('已创建 Task board')
  }
}
</script>
<style>
.timeline{
  overflow: auto;
  background-color: rgb(241, 231, 231);
}
.timeline ul{
  border-top: 1px #ccc solid;
}
.row{
  position: relative;
  height: 32px;
  padding: 8px 0px;
  border-bottom: 1px #ccc solid;
}
.eventFlag{
  position: absolute;
  width: 16px;
  height: 16px;
  border: 1px #ccc solid;
  background-color: rgb(228, 243, 23);
  font-size: 10px;
  vertical-align: middle;
  text-align: center;
  line-height: 14px;
}
.eventFlag span{
  /* display: none; */
  font-size: 12px;
}
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
