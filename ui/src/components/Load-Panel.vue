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
    <div
      v-else-if="status == 'disabled'"
      class="mask disabled"
    />
  </div>
</template>

<script>
export default {
  props: {
    status: {
      type: String,
      default: 'init'
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
    color: #000;
    font-size: 1.5em;
    text-align: center;
    vertical-align: middle;
    background-color: #ffffff00;
}
.loadpanel .loading{
  background-color: #ffffff75;
}
.loadpanel .disabled{
  background-color: #ffffff00;
}
.loadpanel .disabled:hover{
  background-color: #ffffff75;
}
</style>
