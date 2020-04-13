const express = require('express');
// var Ptt = require('../models/model_ptt');
var Task = require('../models/model_task');
var router = express.Router();
var userApi = require('../controllers/userController');

router.get('/login',function (req,res) {  
    res.render('login')
})
router.get('/register',function (req,res) {  
    res.render('register')
})

router.post('/register', userApi.register);
router.post('/login', userApi.login);

module.exports = router;