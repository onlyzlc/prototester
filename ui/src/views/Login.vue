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
        登录
      </button>
      <p>
        没有账号？
        <a href="/regist">注册</a>
      </p>
    </form>
  </main>
</template>

<script>
export default {
  props: {
    to: {
      type: String,
      default: 'Tasks'
    }
  },
  data: function () {
    return {
      user: {
        email: '',
        password: ''
      }
    }
  },
  methods: {
    submit: function () {
      this.$http.post('/login', this.user)
        .then(res => {
          if (res.data.ret_code === 0) {
            // sessionStorage.setItem('user', this.user.email)
            // 返回登录前的状态
            // const orginUrl = sessionStorage.getItem('urlReq') || '/tasks'
            this.$router.push({ name: this.to })
          }
        })
    }
  }
}
</script>

<style></style>
