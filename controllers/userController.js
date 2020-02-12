var User = require("../models/model_user")

exports.register = function(req,res){
    let user = new User({
        email: req.body.email,
        password: req.body.password,
        mobile: req.body.mobile
    })
    user.save(function(err,doc){
        if(err) throw err;
        res.sendStatus(201);
    })
}

exports.login = function (req,res) {
    if(!req.body.hasOwnProperty("email")) return;
    if(typeof(req.body.email) !== "string") return;
    User.findOne({"email":req.body.email},function(err,user){
        if(err) throw err;
        if(user){
            if(req.body.password === user.password){
                res.sendStatus(200);
            }else{
                res.send("密码错误");
            }
        }else{
            res.send("用户不存在");
        }
    })
}