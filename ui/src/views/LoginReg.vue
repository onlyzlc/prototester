<template>
  <main>
        <img src="" alt="">
        <form action="post">
            <div>
                <label for="usersEmail">邮箱</label>
                <input type="email" autocomplete="username" name="usersEmail" id="usersEmail" required>
            </div>
            <div>
                <label for="userPassword">密码</label>
                <input type="password" autocomplete="current-password" name="userPassword" id="userPassword" required>
            </div>
            <button type="submit">提交</button>
            <p>已有账号？<a href="/login">去登录</a></p>
        </form>
    </main>
</template>

<script>
export default {
}
</script>

<style>

</style>
