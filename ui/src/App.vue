<template>
  <div id="app">
    <div id="nav" v-if='Store.state.isVerified'>
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
          {{ userEmail }} |
          <button
            @click="visibility.logoutConfirm = true">
            退出
          </button>
        </div>
      </div>
    </div>
    <router-view />
    <ln-dialog
      title = "确定注销吗"
      :vis = 'visibility.logoutConfirm'
      @click_primary = 'logout'
      @click_secondary = 'visibility.logoutConfirm = false'
      ></ln-dialog>
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
      userEmail: this.Store.state.email,
      visibility: {
        logoutConfirm: false
      }
    }
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
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
  display: flex;
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
