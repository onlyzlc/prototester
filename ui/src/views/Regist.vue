<template>
  <main>
    <form
      @submit.prevent="submit"
    >
      <div>
        <label for="email">邮箱</label>
        <input
          id="email"
          v-model="user.email"
          type="email"
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
      <div
        v-if="errorTip"
        class="errorTip"
      >
        {{ errorTip }}
      </div>
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
// const emails = new Set()
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
      },
      existingEmail: [],
      abnormal: ''
    }
  },
  computed: {
    errorTip () {
      if (this.abnormal) return this.abnormal
      else if (this.existingEmail.includes(this.user.email)) return '此用户已存在'
      else if (this.user.password !== '' &&
        this.user.passwordConfirm !== '' &&
        this.user.password !== this.user.passwordConfirm
      ) return '两次输入密码不一致'
      else return false
    }
  },
  methods: {
    submit () {
      if (this.errorTip) return false
      this.$http.post('/regist', this.user)
        .then(res => this.handler(res))
        .catch(res => { this.abnormal = '网络异常, 无法连接服务器.' })
    },
    handler (res) {
      switch (res.data.ret_code) {
        // 注册成功,跳转到原页面
        case 0: {
          this.user.isVerified = true
          this.Store.update(this.user, 'user')
          this.$router.push({ name: this.to })
          break
        }
        // 注册失败: 邮箱名重复
        case 1: {
          this.existingEmail.push(this.user.email)
          break
        }
        // 注册成功: 登录失败, 跳转到登录页面
        case 2: {
          this.$router.push({ name: 'Login' })
          break
        }
      }
    }
  }
}
</script>

<style></style>
