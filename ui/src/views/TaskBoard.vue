<template>
  <div class="taskBoard">
    <section class="summary">
      <label for="">任务要求</label>
      <p>{{ task.description }}</p>
      <label for="">标准步骤</label>
      <p>
        <router-link :to="{ name: 'Steps' }">
          {{ task.steps.length }} 个步骤
        </router-link>
      </p>
      <label for="">测试统计</label>
      <p>
        共 {{ task.testings.length }} 次测试 |
        <span v-if="task.testings.length">{{ finished.length }} 次完成</span>
      </p>
    </section>
    <section class="userListHeader" />
    <section class="axis">
      <svg
        version="1.1"
        baseProfile="full"
        :width="timeLineWidth"
        height="20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line
          x1="0"
          :x2="timeLineWidth"
          y1="0"
          y2="0"
          stroke="green"
          stroke-width="1"
        />
        <path
          :d="path_d"
          stroke-width="1"
          stroke="gray"
        />
        <text
          v-for="label in axisLabel"
          :key="label"
          :x="label * 1000 * pxPreMS"
          y="18"
          font-size="11"
        >
          {{ label }}
        </text>
      </svg>
    </section>
    <section class="userList">
      <ul>
        <li
          v-for="(test,index) in task.testings"
          :id="test._id"
          :key="test._id"
          class="row"
          :selecetd="selected_id == test._id"
        >
          {{ test.ip }}
          <button v-on:click="delete(index)">删除</button>
        </li>
      </ul>
    </section>
    <section class="timeLine">
      <ul
        :style="{ width: timeLineWidth + 'px' }"
        @click="clickTimeline"
      >
        <li
          v-for="test in task.testings"
          :id="test._id"
          :key="test._id"
          class="row"
          :selecetd="selected_id == test._id"
        >
          <div class="flags">
            <!-- 渲染事件标记 -->
            <div
              v-for="(action, index) in test.log"
              :key="action._id"
              :style="{
                left:
                  (action.timeStamp - test.log[0].timeStamp) * pxPreMS + 'px',
              }"
            >
              <div
                v-if="action.type == 'load'"
                :title="action.type + ':' + action.pageTitle"
              >
                ⏭
              </div>
              <div
                v-else
                :title="action.type + ':' + action.target.innerText"
              >
                {{ index }}
              </div>
            </div>
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
  props: {},
  data () {
    return {
      task: this.Store.state.task,
      // 每毫秒多少像素, 与最大测试耗时一起决定标尺渲染长度
      pxPreMS: 0.1,
      // 标尺精度,每小格多少毫秒, 应该自动缩放
      dx: 100,
      // 标尺刻度间隔(毫秒),间隔多少毫秒标注长线和数字
      unit: 1000,
      // 被选中的测试记录(li的id)
      selected_id: "",
    };
  },
  computed: {
    testings: function () {
      return this.task.testings;
    },
    finished: function () {
      return this.task.testings.filter((item,) => item.isCompleted,);
    },
    maxDur: function () {
      // 最长测试耗时(毫秒)
      let maxDur = 0;
      for (let index = 0; index < this.task.testings.length; index++) {
        const element = this.task.testings[index].log;
        const dur =
          element[element.length - 1].timeStamp - element[0].timeStamp;
        if (dur > maxDur) maxDur = dur;
      }
      return maxDur + 1000;
    },
    timeLineWidth: function () {
      return this.maxDur * this.pxPreMS;
    },
    path_d: function () {
      let d = "M 0 0";
      let i = 0;
      const c = this.maxDur / this.dx;
      while (i <= c) {
        // 整秒画长线, 否则画短线
        if ((this.dx * i) % this.unit) {
          d += "v 10 m 10 -10";
        } else {
          d += "v 20 m 10 -20";
        }
        i++;
      }
      return d;
    },
    axisLabel: function () {
      // 坐标轴标签
      const l = [];
      const c = this.maxDur / this.unit;
      let i = 0;
      while (i <= c) {
        l.push(i,);
        i++;
      }
      return l;
    },
  },
  created () {
    console.log("已创建 Task board",);
  },
  methods: {
    clickTimeline: function (event,) {
      let li = event.target;
      // 找到当前事件绑定的UL下被点击的子元素LI
      while (li.parentElement !== event.currentTarget) {
        li = li.parentElement;
      }
      this.selected_id = li.id;
    },
    delete: function (index) {
      
    }
  },
};
</script>
<style>
.taskBoard {
  display: grid;
  background-color: rgb(241, 231, 231);
  grid-template-areas:
    "sm ulh axis"
    "sm ul tl";
  grid-template-columns: auto auto minmax(200px,10fr);
  grid-template-rows: 20px 1fr;
  width: 100%;
  height: 100%;
}
.summary{
  grid-area: sm
}
.axis{
  grid-area: axis;
  line-height: 0;
}
.userList{
  grid-area: ul;
}
.userListHeader{
  grid-area: ulh;
}
.timeLine{
  grid-area: tl;
  overflow: auto;
}

.summary{
  padding-left: 1em;
  padding-right: 1em;
}

.summary label{
  font-size: 0.8em;
  color: #666;
}

.summary p {
  margin: 0.2em 0 1em 0;
}

.timeLine ul {
}

.row {
  position: relative;
  height: 32px;
  padding: 8px 0px;
  border-bottom: 1px #ccc solid;
  /* overflow: auto; */
}
.row[selecetd] {
  background-color: white;
}
.row .user {

}

.row .flags > * {
  color: transparent;
  font-size: 0.8em;
  position: absolute;
  width: 1.2em;
  height: 1.2em;
  line-height: 1.2em;
  border: 1px #ccc solid;
  background-color: rgb(228, 243, 23);
  vertical-align: middle;
  text-align: center;
}
.row[selecetd] .flags > * {
  color: black;
}

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

.recpanel {
  display: flex;
  height: calc(100% - 40px);
}

.recpanel .left {
  flex: 1;
}

.recpanel .right {
  font-size: 0.8em;
  width: 400px;
  border-left: 1px solid red;
}

.recpanel .right ul {
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
