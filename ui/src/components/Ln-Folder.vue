<template>
  <div>
    <div>
      <button @click="folded = !folded">
        开/合
      </button>
      <slot name="label" ></slot>
    </div>
    <div
      v-if="!folded"
      class="panel"
    >
      <slot name="panel">
        下拉面板
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  props: ['prop'],
  data () {
    return {
      folded: true
    }
  }
}
</script>

<style lang="">

</style>
