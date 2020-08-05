<template>
  <main>
    <form @submit.prevent="submit">
      <div>
        <label for="email">邮箱</label>
        <input
          id="email"
          v-model="user.email"
          type="email"
          autocomplete="username"
          name="email"
          required
        >
      </div>
      <div>
        <label for="password">密码</label>
        <input
          id="password"
          v-model="user.password"
          type="password"
          autocomplete="current-password"
          name="password"
          required
        >
      </div>
      <button type="submit">
        提交
      </button>
      <p>
        已有账号？
        <a href="/login">去登录</a>
      </p>
    </form>
  </main>
</template>

<script>
import appStore from '../store'
export default {
  data: function () {
    return {
      user: {
        email: '',
        password: ''
      },
      state: appStore.state
    }
  },
  methods: {
    submit: function () {
      this.$http.post('/login', this.user)
        .then(res => {
          if (res.data.ret_code === 0) {
            // sessionStorage.setItem('user', this.user.email)
            // const orginUrl = sessionStorage.getItem('urlReq') || '/tasks'
            // this.$router.push(orginUrl)
            appStore.updateUser({
              isVerified: true,
              email: this.user.email
            })
          }
        })
    }
  }
}
</script>

<style></style>
