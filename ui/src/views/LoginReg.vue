<template>
  <main>
    <img src alt />
    <form @submit.prevent="submit">
      <div>
        <label for="email">邮箱</label>
        <input
          v-model="user.email"
          type="email"
          autocomplete="username"
          name="email"
          id="email"
          required
        />
      </div>
      <div>
        <label for="password">密码</label>
        <input
          v-model="user.password"
          type="password"
          autocomplete="current-password"
          name="password"
          id="password"
          required
        />
      </div>
      <button type="submit">提交</button>
      <p>
        已有账号？
        <a href="/login">去登录</a>
      </p>
    </form>
  </main>
</template>

<script>
export default {
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
      this.$http.post('/login', this.user).then()
    }
  }
}
</script>

<style></style>
