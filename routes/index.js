const express = require('express');
// var Ptt = require('../models/model_ptt');
var Task = require('../models/model_task');
var router = express.Router();

router.get('/login',function (req,res) {  
    res.render('login')
})
router.get('/register',function (req,res) {  
    res.render('register')
})

module.exports = router;