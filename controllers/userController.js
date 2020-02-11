var User = require("../models/model_user")

exports.register = function(req,res){
    let user = new User({
        email: req.body.email,
        password: req.body.password,
        mobile: req.body.mobile
    })
    user.save(function(err,doc){
        
    })
    res.send("连接到注册接口")
}

exports.login = function (req,res) {  
    res.send("链接到登录接口")
}