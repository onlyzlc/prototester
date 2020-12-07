<template>
  <div id="app">
    <div
      v-if="false"
      id="nav"
    >
      <div class="links">
        <router-link to="/tasks">
          测试任务
        </router-link> |
        <router-link to="/setting">
          设置
        </router-link>
      </div>
      <div class="right">
        <div>
          {{ Store.state.email }} |
          <button
            @click="visibility.logoutConfirm = true"
          >
            退出
          </button>
        </div>
      </div>
    </div>
    <router-view />
    <ln-dialog
      title="确定注销吗"
      :vis="visibility.logoutConfirm"
      @click_primary="logout"
      @click_secondary="visibility.logoutConfirm = false"
    />
  </div>
</template>

<script>
import LnDialog from './components/Ln-Dialog.vue'
export default {
  components: {
    LnDialog
  },
  data () {
    return {
      visibility: {
        logoutConfirm: false
      }
    }
  },
  computed: {
  },
  methods: {
    // 注销
    logout () {
      this.$http.post('/logout')
        .then(res => {
          if (res.status === 200) {
            this.Store.clear()
            this.$router.push({ name: 'Login' })
            this.visibility.logoutConfirm = false
            if (this.Store.debug) console.log('已注销')
          }
        })
    }
  }
}
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
