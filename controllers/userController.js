var User = require("../models/model_user")

exports.register = function(req,res){
    console.log("-> 导航到用户注册");
    let email = req.body.email;
    let pw = req.body.password;
    if(!email || !pw ) {
        res.status(403).end("邮箱和地址不能为空");
        return;
    };

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
        res.redirect(302,"/");
    })
}

exports.login = function (req,res) {
    console.log("-> 用户登录");
    
    if(!req.body.hasOwnProperty("email")) return;
    if(typeof(req.body.email) !== "string") return;
    let pw = req.body.password ;
    User.findOne({"email":req.body.email},function(err,user){
        if(err) throw err;
        if(user){
            if( pw === user.password){
                req.session.regenerate(function(err){ 
                    if(err){
                        // todo 登录失败提示；
                        return res.json({ret_code:2,ret_msg:"登录失败"})
                    } 
                    req.session.loginUser = user.id;
                    // res.status(200).json({ret_code:0,ret_msg:"登录成功"});
                    res.redirect(302,'/tasks');
                })
            }else{
                res.json({ret_code:1,ret_msg:"用户名或密码错误"})
            }
        }else{  
            res.send("用户不存在");
        }
    })
}

exports.getProtos = function(req,res){
    console.log("-> 导航到获取用户原型,用户：%s",req.session.loginUser);
    User.findOne({_id:req.session.loginUser},function(err,doc){
        if(err) throw err;
        if(doc){
            res.json(doc.protos)
        }else{
            res.sendStatus(404);
        }
    })

}