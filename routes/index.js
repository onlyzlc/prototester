const express = require('express');
var router = express.Router();
var userApi = require('../controllers/userController');

// router.get('/login',function (req,res) {  
//     res.render('login')
// })
// router.get('/register',function (req,res) {  
//     res.render('register')
// })

router.post('/register', userApi.register);
router.post('/login', userApi.login);

module.exports = router;