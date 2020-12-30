<template>
  <div class="loadpanel">
    <slot />
    <div
      v-if="status == 'loading'"
      class="mask loading"
    >
      载入中...
    </div>
    <div
      v-else-if="status == 'empty'"
      class="mask empty"
    >
      无数据
    </div>
    <div
      v-else-if="status == 'error'"
      class="mask error"
    >
      载入错误
    </div>
  </div>
</template>

<script>
export default {
  props: {
    status: {
      type: String,
      default: 'init',
      validator: function (value) {
        // 这个值必须匹配下列字符串中的一个
        return ['init', 'loading', 'empty', 'error'].indexOf(value) !== -1
      }
    }
  }

}
</script>

<style>
.loadpanel{
    box-sizing: border-box;
    position: relative;
    min-height: 100px;
}
.loadpanel .mask {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
    width: 100%;
    height: 100%;
    color: gray;
    background-color: #ffffff00;
}
</style>
