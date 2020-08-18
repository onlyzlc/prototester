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
      <div
        v-if="errorTip"
        class="errorTip"
      >
        {{ errorTip }}
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
        password: '',
        isVerified: false
      },
      errorTip: ''
    }
  },
  computed: {
  },
  methods: {
    submit: function () {
      this.$http.post('/login', this.user)
        .then(res => this.handler(res))
        .catch(res => { this.errorTip = '网络似乎有问题, 连不上服务器' })
    },
    handler: function (res) {
      switch (res.data.ret_code) {
        // 登录成功
        case 0: {
          this.user.isVerified = true
          this.Store.updateUser(this.user)
          this.$router.push({ name: this.to })
          break
        }
        // 登录失败: 用户名或密码错误
        case 1: {
          this.errorTip = '用户名或密码错误'
          break
        }
        // 登录失败: 用户不存在
        case 2: {
          this.errorTip = '用户不存在'
          // this.nonexistentUsers.push()
          break
        }
        default: {
          this.errorTip = '系统错误, 请稍后再试'
          break
        }
      }
    }
  }
}
</script>

<style></style>
