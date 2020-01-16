const fs = require('fs');
// var Ptt = require('../models/model_ptt');
const Task = require('../models/model_task')
const UserTest = require('../models/model_userTest');
var path = require('path');

exports.createPtt = function (req,res,next) {
    console.log("-> 注册原型");
    let postData = req.body;
    function create() {
        Ptt.create({
            name: postData.ptturl ,
            url: postData.ptturl,
            pttId: Math.trunc(Math.random() * 99999)+10000
        },function(err,newPtt){
            // 万一是重复ID,则重新创建
            if (err && err.code!=  undefined  &&  err.code== 11000) {
                if(err.keyPattern.pttId){
                    // 如果ID重复则重新创建
                    create();
                }else if(err.keyPattern.name || err.keyPattern.url){
                    // 如果是名称或URL重复
                    console.log('原型已存在');
                    // 查询返回该原型的ID给前端
                    Ptt.findOne({name: postData.ptturl}).exec(function (err, ptt) {
                        res.status(201).end(ptt.pttId);
                    })
                }
            }else if(err) {
                // 其他错误
                res.status(404).end();
            }else{
                // 创建成功
                console.log('已创建一条原型记录'+newPtt.pttId);
                res.status(201).end(newPtt.pttId);
            }
        })
    }
    create();
}

// 获取当前原型(只要是/:ptt/的路径都可获取到)
exports.getPtt = function (req, res, next) {
    console.log('-> 获取当前原型:');
    if (req.params.pttId == undefined) throw 'urlError';
    Ptt.findOne().byPttId(req.params.pttId).exec(function (err, doc) {
        if (err) throw err;
        if(doc === null) {
            // 该原型不存在
            console.log(req.params.pttId + '原型不存在');
            res.send(404);
            return;
        }else{
            req.ptt = doc;
            console.log(doc.name);
            next();
        }
    })
}

exports.create = function (req, res) {
    let newTask = new Task(req.body);
    newTask.TaskId = Date.now();
    Task.create(
        req.body,
        function (err, doc) {  
            console.log('任务创建成功');
            res.sendStatus(201);
        }
    )
}

exports.updateTask = function (req,res) {
    console.log("-> 更新任务数据");
    let task = req.ptt.tasks[req.params.taskIndex - 1];
    if(req.body.logs){
        task.steps = task.steps.concat(req.body.logs);
        console.log(req.body.logs);
        req.ptt.save(function (err) {
            res.status(200).end('任务步骤更新成功');
        });
    }else{
        res.status(200).end();
    }
}

exports.deleteTask = function (req, res) {
    console.log("-> 删除任务");
    req.ptt.tasks.splice(req.params.taskIndex - 1, 1);
    req.ptt.save(function (err,result) {
        res.end('已删除任务'+result.taskIndex);
    });
}

exports.getTaskPage = function (req, res) {
    let v = req.ptt.tasks[req.params.taskIndex - 1];
    // 所有测试的数量
    v.testCount = 0;
    // 存放已完成的测试
    v.completedTest = [];
    v.completedRatio = 0;
    v.avgOfDuration = "--";
    UserTest.find().byTaskId(v.id).exec(function (err, userTests) {
        if (err) throw err;
        // 测试人次
        v.testCount = userTests.length;
        if (v.testCount == 0) {
            res.render('task', v);
            return;
        }
        // 筛选完成任务的测试
        v.completedTest = userTests.filter(usertest => usertest.isCompleted);
        v.completedRatio = Math.round((v.completedTest.length/v.testCount)*100);
        // 获取各次测试的完成时间求平均值
        let avgOfDuration = 0;
        for (const userTest of v.completedTest) {
            avgOfDuration += userTest.totalDuration;
        }
        v.avgOfDuration = (avgOfDuration / v.testCount / 1000).toFixed(2);

        res.render('task', v);
    })
}

exports.getTaskData= function(req,res){
    let taskData = {};
    taskData.task = req.ptt.tasks[req.params.taskIndex - 1];
    UserTest.find().byTaskId(taskData.id).exec(function (err, userTests) {
        if (err) throw err;
        // 测试人次
        taskData.userTests = [].concat(userTests) ;
        res.send(taskData);
    })
}

exports.getTaskSettingPage = function(req,res){
    console.log('-> 任务设置页面');
    let taskDoc = req.ptt.tasks[req.params.taskIndex - 1];
    
    res.render('taskSetting',{
        steps: taskDoc.steps,
        name: taskDoc.name
    })
}

exports.getTaskSettingSteps = function (req,res) {  
    console.log('-> 获取未完成设置的步骤数据');
    let taskDoc = req.ptt.tasks[req.params.taskIndex - 1];
    res.status(200).json(taskDoc.steps);
}