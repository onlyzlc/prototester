<template>
  <div
    v-if="vis"
    class="dialog_container"
  >
    <div class="dialog_panel">
      <div class="dialog_header">
        <h3>{{ title }}</h3>
        <i
          class="close"
          @click="$emit('cancel')"
        />
      </div>
      <div class="dialog_content">
        <slot />
      </div>
      <div class="dialog_foot">
        <div class="left">
          <slot name="foot_left" />
        </div>
        <div class="right">
          <slot name="foot_right">
            <button
              class="primary"
              @click="$emit('click_primary')"
            >
              {{ btnPrimary }}
            </button>
            <button
              class="secondary"
              @click="$emit('click_secondary')"
            >
              {{ btnSecondary }}
            </button>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DialogLn',
  props: {
    title: {
      type: String,
      default: '对话框'
    },
    vis: {
      type: Boolean,
      default: false
    },
    btnPrimary: {
      type: String,
      default: '确定'
    },
    btnSecondary: {
      type: String,
      default: '取消'
    }
  }
}
</script>

<style scoped>

    .dialog_container{
        position: fixed;
        height: 100%;
        width: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        top: 0;
        left: 0;
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .dialog_panel{
        padding: 20px ;
        min-width:300px;
        min-height: 20px;
        background-color: white;
        border-radius: 5px;
        display: flex;
        flex-flow: column;
    }
    .dialog_header{
        display: flex;
        flex-flow: row;
        align-items: center;
    }
    .dialog_header h3{
        margin: 0;
        flex-grow: 1;
    }
    .dialog_header i.close{
        width: 20px;
        height: 20px;
        background-color: bisque;
    }
    .dialog_content {
        padding: 1em 0;
        flex-grow: 1;
    }

    .dialog_foot{
        display: flex;
        flex-flow: row;
    }

    .dialog_foot .left{
    flex-grow: 1;
    }

    button.primary{

    }
</style>
