<template>
  <button type="button" class="ln-btn" >
      <slot>
          button
      </slot>
  </button>
</template>

<script>
export default {
    props:{
        Category: {
            type: String,
            validator: function (value) {
                return ['']
            }
        }
    }
}
</script>

<style>
.ln-btn{

}
</style>