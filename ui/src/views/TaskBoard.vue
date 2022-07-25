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
        <svg version="1.1"
            baseProfile="full"
            :width="timeLineWidth" height="20"
            xmlns="http://www.w3.org/2000/svg">
            <line x1="0" :x2="timeLineWidth" y1="0" y2="0" stroke="green" stroke-width="1"/>
            <path :d="path_d" stroke-width="1" stroke="gray"/>
            <text
              v-for = "label in axisLabel"
              :key = "label"
              :x="label*1000*pxPreMS"
              y="18"
              font-size="11">
              {{label}}
              </text>
        </svg>
      </div>
      <ul v-bind:style="{width:timeLineWidth+'px'}">
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
      // 每毫秒多少像素, 与最大测试耗时一起决定标尺渲染长度
      pxPreMS: 0.1,
      // 标尺精度,每小格多少毫秒, 应该自动缩放
      dx: 100,
      // 标尺刻度间隔(毫秒),间隔多少毫秒标注长线和数字
      unit: 1000
    }
  },
  computed: {
    testings: function () { return this.task.testings },
    finished: function () {
      return this.task.testings.filter(item => item.isCompleted)
    },
    // 最长测试耗时(毫秒)
    maxDur: function () {
      let maxDur = 0
      for (let index = 0; index < this.task.testings.length; index++) {
        const element = this.task.testings[index].log
        const dur = element[element.length - 1].timeStamp - element[0].timeStamp
        if (dur > maxDur) maxDur = dur
      }
      return maxDur + 1000
    },
    timeLineWidth: function () {
      return this.maxDur * this.pxPreMS
    },
    path_d: function () {
      let d = 'M 0 0'
      let i = 0
      const c = this.maxDur / this.dx
      while (i <= c) {
        // 整秒画长线, 否则画短线
        if (this.dx * i % this.unit) {
          d += 'v 10 m 10 -10'
        } else {
          d += 'v 20 m 10 -20'
        }
        i++
      }
      return d
    },
    axisLabel: function () {
      const l = []
      const c = this.maxDur / this.unit
      let i = 0
      while (i <= c) {
        l.push(i)
        i++
      }
      return l
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
.axis{
  line-height: 0;
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
