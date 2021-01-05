<template>
  <div class="popConfirm" style="margin: 200px">
    <div class="popup" v-if="showPopup" @focusout="showPopup = false">
      <p>{{ txt_tip }}</p>
      <p>
        <button @click="$emit('onClickOk')">{{ txt_ok }}</button
        ><button @click="$emit('onClickCancel')">{{ txt_cancel }}</button>
      </p>
    </div>
    <div class="pupup_trigger" @click="showPopup = true">
      <!-- <slot /> -->
      删除
    </div>
  </div>
</template>

<script>
export default {
  props: {
    txt_tip: {
      type: String,
      default: "提示",
    },
    txt_ok: {
      type: String,
      default: "确定",
    },
    txt_cancel: {
      type: String,
      default: "取消",
    },
  },
  data() {
    return {
      showPopup: false,
      style_popup: {
        position: "absoulte",
        left: 0,
        right: 0,
        zIndex: 100,
      },
    };
  },
  mounted(){
    
  }
};
</script>
<style>
.popConfirm{
    position: relative;
    display: inline-block;
}
.popConfirm .pupup_trigger{
    display: inline-block;
}
.popConfirm .popup{
    position:absolute;
    z-index: 100;
    top: -100px;
    height: 100px;
    left: -100px;
    width: 200px;
    box-sizing: border-box;
    padding: 10px;
    border: 1px solid #eaeaea;
    border-radius: 4px;
}
</style>