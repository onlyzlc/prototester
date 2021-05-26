const fs = require('fs');
// var Ptt = require('../models/model_ptt');
const Task = require('../models/model_task')
const User = require('../models/model_user');
var path = require('path');

// 获取任务列表
exports.getTasks = function(req,res){
    Task.find({owner:req.session.loginUser},function(err,tasks){
        if (err) throw err;
        res.json(tasks);
    }) 
}
// 创建任务
exports.create = function (req, res) {
    // 计算每步时长
    // addDur(req.body.steps);
    // 去除无效步骤
    // removeInvalidSteps(req.body.steps);

    let newTask = new Task({
        owner: req.session.loginUser,
        name: req.body.name,
        description: req.body.description,
        taskId: Date.now().toString(36),
        ptt:{
            url: req.body.pttUrl
        }
        // steps: req.body.steps,
    });
    newTask.save(
        function (err, doc) {
            if (err) throw err;
            console.log('任务创建成功');
            res.status(201).end(newTask.taskId);
        }
    )
}

// 更新任务步骤
exports.updateSteps = function (req, res) {
    console.log("-> 更新任务步骤数据");
    // 计算每步时长
    addDur(req.body.steps);
    // 去除无效步骤
    removeInvalidSteps(req.body.steps);
    Task.findOneAndUpdate({
        "taskId": req.params.taskId
    }, {
        steps: req.body.steps,
    }, function (err, taskDoc) {
        if (err) throw err;
        if (taskDoc === null) {
            noTaskTip(res);
            return;
        }
        res.sendStatus(201);
    })
}
// 更新任务状态
exports.updateStatus = function (req, res) {
    console.log("-> 更新任务状态未为 %s",req.body.status);
   
    Task.findOneAndUpdate({
        "taskId": req.params.taskId
    }, {
        status: req.body.status
    }, function (err, taskDoc) {
        if (err) throw err;
        if (taskDoc === null) {
            noTaskTip(res);
            return;
        }
        res.sendStatus(200);
    })
}
// 删除任务
exports.deleteTask = function (req, res) {
    console.log("-> 删除任务");
    Task.findOneAndUpdate({
        "taskId": req.params.taskId
    },{
        deleted: true,
        deleteTime: Date.now()
    }, function (err, taskDoc) {
        if (err) throw err;
        if (taskDoc === null) {
            noTaskTip(res);
            return;
        }
        res.sendStatus(200);
    })
}

// 返回任务测试提要,包括任务步骤,描述
exports.getTaskNote = function (req, res) {
    console.log('-> 获取任务的测试提要');
    Task.findOne({
        "taskId": req.params.taskId
    }, "steps description status", function (err, taskDoc) {
        if (err) throw err;
        if (taskDoc === null) {
            noTaskTip(res);
            return;
        }

        if( taskDoc.status === 'unpublished'){
            // 任务未发布
            res.sendStatus(204)
        }
        else if (taskDoc.steps.length > 0) {
            let {steps ,description} = taskDoc;
            steps.splice(1, steps.length - 2);
            res.status(200).json({
                steps: steps,
                description: description
            });
        } else {
            res.sendStatus(404)
        }
    })
}
// 获取任务
exports.getDetail = function (req, res) {
    console.log("-> 获取任务详情");
    Task.findOne({
        "taskId": req.params.taskId
    }, function (err, taskDoc) {
        if (err) throw err;
        if (taskDoc === null) {
            noTaskTip(res);
            return;
        }
        res.json(taskDoc);
    })
}

// 工具
// 计算两个行为间的时长，最后一个行为不计算，默认值0
function addDur(actions) {
    // 便于渲染时直接获取时长
    for (let i = 0; i < actions.length - 1; i++) {
        actions[i].dur = actions[i + 1].timeStamp - actions[i].timeStamp;
    }
}

// 去除无效行为
function removeInvalidSteps(actions) {
    // 如果最后一个行为是load，则去除
    if (actions[actions.length - 1].eventType === "load") {
        actions.pop();
    }
}

// 标记与步骤
function mark(actions) {

}

function noTaskTip(res) {
    res.sendStatus(404);
}
