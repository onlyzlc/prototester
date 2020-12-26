<template>
  <div class="about">
    <div id="nav">
      <div class="links">
        <router-link to="/login">
          登录
        </router-link> |
        <router-link to="/regist">
          注册
        </router-link>
      </div>
    </div>
    <router-view />
    <h1>This is an about page</h1>
  </div>
</template>
