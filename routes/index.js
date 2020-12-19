const express = require('express');
var router = express.Router();
var userApi = require('../controllers/userController');

// 中间件:登陆检查
router.use('/', (req, res, next) => {
    let user = req.session.loginUser;
    let isLogined = !!user;
    let reg = /\/login|\/regist|\/favicon.ico|\/testing/;
    // 若已登录，或请求路径为登录或注册时，直接跳过，否则跳转到登录页。
    if (isLogined || reg.test(req.url)) {
      if(global.DEBUG) console.log("用户：%s 请求: %s, 剩余有效期: %s", user, req.url, req.session.cookie.maxAge);
      next();   
    } else {
      console.log("未登录用户请求：%s", req.url);
      res.sendStatus(511);
    }
  });

router.use('/tasks', require('./tasks'));
router.use('/userTest', require('./userTests'));

router.post('/regist', userApi.regist);
router.post('/login', userApi.login);
router.post('/logout', userApi.logout);


module.exports = router;
