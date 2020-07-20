<template>
  <main>
    <img src="" alt="" />
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
        <label for="pw">密码</label>
        <input
          v-model="user.pw"
          type="password"
          autocomplete="current-password"
          name="pw"
          id="pw"
          required
        />
      </div>
      <button type="submit">提交</button>
      <p>已有账号？<a href="/login">去登录</a></p>
    </form>
  </main>
</template>

<script>
import axios from "axios";
export default {
  data: {
    user: {
      email: "",
      pw: ""
    }
  },
  methods: {
    submit: function() {
      axios.post("/login", this.user).then();
    }
  }
};
</script>

<style></style>
