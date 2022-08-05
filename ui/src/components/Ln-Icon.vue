<template>
  <svg class="icon">
    <use :xlink:href="`#${name}`" />
  </svg>
</template>

<script>
export default {
  name: "Icon",
  prop: {
    name: {
      type: String,
      require: true,
    },
  },
};
</script>
