<template>
  <div>
    <div style="position:absolute; top:20px; left: 20px">
      <ln-popconfirm direction="auto" />
    </div>
    <div style="position:absolute; bottom:20px; left: 20px">
      <ln-popconfirm direction="auto" />
    </div>
    <div style="position:absolute; bottom:20px; right: 20px">
      <ln-popconfirm direction="auto" />
    </div>
    <div style="position:absolute; top:20px; right: 20px">
      <ln-popconfirm direction="auto" />
    </div>
  </div>
</template>

<script>
import LnPopconfirm from './Ln-Popconfirm'
export default {
  components: {
    LnPopconfirm
  }
}
</script>

<style>

</style>
