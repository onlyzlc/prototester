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
          required
        >
      </div>
      <div>
        <label for="password">确认密码</label>
        <input
          id="password"
          v-model="user.passwordConfirm"
          type="password"
          required
        >
      </div>
      <div v-if='errorTip'>{{ errorTip }}</div>
      <button type="submit">
        注册
      </button>
      <p>
        已有账号？
        <a href="/login">去登录</a>
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
        password: '',
        passwordConfirm: '',
        isVerified: false
      }
    }
  },
  computed: {
    errorTip: function () {
      if (this.password !== this.passwordConfirm) return '两次输入密码不一致'
      else return ''
    }
  },
  methods: {
    submit: function () {
      this.$http.post('/regist', this.user)
        .then(res => this.registSecuess(res))
    },
    registSecuess: function (res) {
      if (res.data.ret_code === 0) {
        this.user.isVerified = true
        this.Store.updateUser(this.user)
        this.$router.push({ name: this.to })
      }
    }
  }
}
</script>

<style></style>
