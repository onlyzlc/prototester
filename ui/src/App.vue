<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
</script>

<style>
/* 导入优化样式表 */
@import url('/css/sanitize.css');
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
#nav {
  display: flex;
  height: 40px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
#nav .links{
  display: flex;
  flex: auto;
}
#nav .right{
  display: flex;
}
</style>
