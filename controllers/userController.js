var User = require("../models/model_user")

exports.register = function(req,res){
    console.log("-> 导航到用户注册");
    if(undefined === req.body.email ||req.body.email ) return;
    if(typeof(req.body.email) !== "string") return;

    let user = new User({
        email: req.body.email,
        password: req.body.password,
    })
    user.save(function(err,doc){
        if(err){
            if(err.code === 11000){
                res.status(403).end("EmailRepeat");
                return;
            }else{
                throw err;
            }
        }
        console.log("创建用户成功");
        res.sendStatus(201);
    })
}

exports.login = function (req,res) {
    console.log("-> 导航到用户登录");
    
    if(!req.body.hasOwnProperty("email")) return;
    if(typeof(req.body.email) !== "string") return;
    User.findOne({"email":req.body.email},function(err,user){
        if(err) throw err;
        if(user){
            if(req.body.password === user.password){
                let sess = req.session;
                req.session.regenerate(function(err){ 
                    if(err){
                        return res.json({ret_code:2,ret_msg:"登录失败"})
                    } 
                    req.session.loginUser = user.email;
                    res.json({ret_code:0,ret_msg:"登录成功"});
                })
                res.sendStatus(200);
            }else{
                res.json({ret_code:1,ret_msg:"用户名或密码错误"})
            }
        }else{
            res.send("用户不存在");
        }
    })
}

exports.getProtos = function(req,res){
    console.log("-> 导航到获取用户原型");
    // User.findOne("email")
}