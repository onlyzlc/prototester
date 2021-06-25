// var Ptt = require('../models/model_ptt');
var UserTest = require('../models/model_userTest');
var Task = require('../models/model_task');
var cookieOption = {};

function setNextTask(task,index,total,res){
    // 设置任务信息
    var nextTask = {
        name: task.name,
        id: task.id,
        url: task.steps[0].url, // 需替换为真实路径
        end: task.steps[task.steps.length - 1],
        index: index,
        total: total,
    }

    // 设置Cookie
    res.cookie('task', JSON.stringify(nextTask));
    res.cookie('testId', "");
    // 前端收到信号后会跳转到cookie中task指定的页面;
    res.send(200);
}

// 查询下一个任务
exports.getNextTask = function (req, res) {
    console.log('导航到:获取下一个任务');
    
    var ptturl = req.query.ptturl;

    Ptt.findOne().byUrl(ptturl).exec(function (err, ptt) {
        if (err) throw err;
        if (ptt && ptt.tasks.length) {
            // 如果原型及其任务存在
            // 如果Cookie中有任务, 则选择查找并选择下一个任务
            // 如果任务已经完全完成,则清空Cookie
            if (req.cookies.task) {
                var currentTask = JSON.parse(req.cookies.task);
                console.log('当前任务:' + currentTask.name);
                
                if (currentTask.id == undefined) {
                    // 任务ID丢失
                    console.log('当前任务丢失');
                    res.send(404);
                    return;
                }

                // 获取当前任务下标
                var i = ptt.tasks.findIndex((item, index) => {
                    return item.id == currentTask.id;
                });

                // 下一个任务
                i++;

                var l = ptt.tasks.length;
                if (i == l) {
                    // 全部任务已完成
                    console.log('任务全部完成');
                    // 清空Cookie
                    res.clearCookie('task');
                    res.clearCookie('testId');
                    // res.render('finish');
                    res.status(200).send('finished');
                }else{
                    // 找到下一个任务
                    var task = ptt.tasks[i];
                    setNextTask(task,i++,l,res);
                    console.log('已找到下一个任务' + task.id);
                }

            } else {
                // Cookie中没有存任务, 取原型的第一个任务
                task = ptt.tasks[0];
                setNextTask(task,0,result.tasks.length,res);
                console.log('找到第一个任务');
            }
           
        } else {
            console.log('该原型还未添加任务.');
            res.send('init');
        }
    })

}


exports.post = function (req, res) {
    console.log('导航到:新增用户测试');
    // 判断是否已创建测试
    if (req.cookies.userTest === undefined) {
        Task.findOne({taskId: req.body.taskId}, function (err,task) {
            if(err) throw '找不的对应的任务';
            UserTest.create({
                task: task.id,
                ip: req.ip.split(":")[3]
            }, function(err, userTest){
                // 设置当前测试的id,存入cookie
                console.log('已创建一条用户测试记录');
                let id = userTest.id
                res.cookie('userTestId',id)
                res.send(200)
            })
        })
    }else{
        console.log('可能因网络问题, 已存在相同的测试案例, 将覆盖原测试结果');
    }
}

exports.patch = function (req, res) {
    console.log('导航到:更新用户测试的日志');
    UserTest.findById(req.cookies.userTestId, function (err, userTest) {
        if (err) throw err;
        if (userTest) {
            var l = req.body.log.length;
            userTest.isCompleted = req.body.isCompleted;
            for (var i = 0; i < l; i++) {
                userTest.log.push(req.body.log[i]);
            }
            if(userTest.isCompleted) res.clearCookie('userTestId');
            userTest.save(function (err,doc) {
                res.sendStatus(201);
                console.log("更新成功,任务完成状态:"+doc.isCompleted);
            });
        } else {
            console.log('找不到此对应测试实例,数据可能被篡改');
            res.clearCookie('userTestId');
            res.status(410).send('Cookie可能被篡改');
        }
    })
}

exports.del = function(req,res){
    res.clearCookie('task');
    res.clearCookie('userTestId');
    // res.send(200);
    res.render('finish');
    console.log('Cookie已清除');
}