const fs = require('fs');
// var Ptt = require('../models/model_ptt');
const Task = require('../models/model_task')
const User = require('../models/model_user');
var path = require('path');

exports.getTasks = function(req,res){
    Task.find({owner:req.session.loginUser},function(err,tasks){
        if (err) throw err;
        res.json(tasks);
    }) 
}

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

// 更新任务步骤/更新任务状态
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
        res.status(200).end("任务步骤更新成功");
    })
}

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

exports.deleteTask = function (req, res) {
    console.log("-> 删除任务");
    Task.findOneAndDelete({
        "taskId": req.params.taskId
    }, function (err, taskDoc) {
        if (err) throw err;
        if (taskDoc === null) {
            noTaskTip(res);
            return;
        }
        res.status(200).end('任务已删除');
    })
}

exports.getTaskSettingPage = function (req, res) {
    console.log('-> 任务设置页面');
    Task.findOne({
        "taskId": req.params.taskId
    }, "name steps", function (err, taskDoc) {
        if (err) throw err;
        if (taskDoc === null) {
            noTaskTip(res);
            return;
        }
        res.json({
            steps: taskDoc.steps,
            name: taskDoc.name
        })
    })
}

exports.getSteps = function (req, res) {
    console.log('-> 获取未完成设置的步骤数据');
    Task.findOne({
        "taskId": req.params.taskId
    }, "steps", function (err, taskDoc) {
        if (err) throw err;
        if (taskDoc === null) {
            noTaskTip(res);
            return;
        }
        if (taskDoc.steps.length > 0) {
            res.status(200).json(taskDoc.steps);
        } else {
            res.status(200).end("null");
        }
    })
}

exports.getTestingPage = function (req, res) {
    console.log('-> 进入测试页');
    res.json("testing");
}

// 返回任务的测试提要,包括任务首尾步骤,任务描述
exports.getTaskNote = function (req, res) {
    console.log('-> 获取任务的测试提要');
    Task.findOne({
        "taskId": req.params.taskId
    }, "steps description", function (err, taskDoc) {
        if (err) throw err;
        if (taskDoc === null) {
            noTaskTip(res);
            return;
        }
        if (taskDoc.steps.length > 0) {
            let {steps ,description} = taskDoc;
            steps.splice(1, steps.length - 2);
            res.status(200).json({
                steps: steps,
                description: description
            });
        } else {
            res.status(200).end("null");
        }
    })
}

exports.updateTesting = function (req, res) {
    console.log('-> 更新任务测试数据');
    Task.findOne({
        "taskId": req.params.taskId
    }, function (err, taskDoc) {
        if (err) throw err;
        if (taskDoc === null) {
            noTaskTip(res);
            return;
        }
        req.body.ip = req.ip;

        // 添加行为间隔时长
        addDur(req.body.actions);
        // 移除无效行为
        removeInvalidSteps(req.body.actions);

        const steps = taskDoc.steps;
        // 遍历所有步骤，查找并标记匹配步骤的行为
        for (let i = 0; i < steps.length; i++) {
            let step = steps[i];
            // 匹配条件
            let isMatched = function (action) {
                return action.eventType == step.eventType &&
                    action.target.domId == step.target.domId &&
                    action.target.nodeName == step.target.nodeName &&
                    action.target.innerText == step.target.innerText
            }
            // 找到与当前步骤相同的行为，并在行为上记录下匹配的步骤序号
            let matchingIndex = req.body.actions.findIndex(isMatched);
            if (matchingIndex >= 0) {
                req.body.actions[matchingIndex].matchingStep = i;
            }
        }

        taskDoc.testing.push(req.body);
        taskDoc.save(function (err) {
            if (err) throw err;
            res.sendStatus(200);
        })
    })
}

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
        if (taskDoc.testCount == 0) {
            // todo 还未进行测试时，需显示一个提示
            res.json(taskDoc);
            return;
        }
        res.json(taskDoc);
    })
}

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
