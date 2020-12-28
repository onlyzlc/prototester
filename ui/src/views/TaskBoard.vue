<template>
  <div>
    TaskBoard
    
  </div>
</template>

<script>
export default {
  props: ['taskId'],
  data () {
    return {
    }
  },
  created () {
  },
  methods: {
    store (taskNote) {
      this.pttUrl = taskNote.steps[0].url
      this.tip = taskNote.description
      this.stop = taskNote.steps[1]
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
