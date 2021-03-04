<template>
  <div class="test">
    <div class="one">
      <ln-popconfirm direction="auto"></ln-popconfirm>
    </div>
    <div class="two">
      <ln-popconfirm direction="auto"></ln-popconfirm>
    </div>
    <div class="three">
      <ln-popconfirm 
        direction="auto" 
        txt_tip="确定提交吗？" 
        txt_ok="提交">
        <button>提交</button>
      </ln-popconfirm>
    </div>
    <div class="four">
      <ln-popconfirm direction="auto" :width=300 :height=200>
        删除
      </ln-popconfirm>
    </div>
  </div>
</template>

<script>
import LnPopconfirm from "./Ln-Popconfirm";
export default {
  components: {
    LnPopconfirm,
  },
};
</script>

<style>
.test > div {
  position: absolute;
}
.one {
  top: 20px;
  right: 20px;
}
.two {
  top: 20px;
  left: 20px;
}
.three {
  bottom: 20px;
  left: 20px;
}
.four {
  bottom: 20px;
  right: 20px;
}
</style>