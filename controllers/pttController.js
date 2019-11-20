const fs = require('fs');
var Ptt = require('../models/model_ptt');
const UserTest = require('../models/model_userTest');
var path = require('path');

// 获取所有原型
exports.getAllPtt = function (req, res) {
    Ptt.find({}, function (err, docs) {
        if (err) throw err;
        // 渲染原型列表
        let viewData = {
            title: '我的原型',
            ptts: docs,
            url: ''
        }
        res.render('ptts', viewData)
    })
}

// 获取当前原型(只要是/:ptt/的路径都可获取到)
exports.getPtt = function (req, res, next) {
    console.log('导航到:获取当前原型');
    if (req.params.ptt == undefined) throw 'urlError';
    Ptt.findOne().byName(req.params.ptt).exec(function (err, doc) {
        if (err) throw err;
        req.ptt = doc;
        next();
    })
}

exports.getPttPage = function (req, res) {

    let viewData = {
        title: req.ptt.name,
        ptt: req.ptt,
        tasks: req.ptt.tasks,
    };
    res.render('ptt', viewData);
}

exports.getNewTaskPage = function (req, res) {
    // 获取原型的所有页面链接
    let viewData = {
        htmlList: [],
        title: req.ptt.name + '的新任务'
    };
    let folderPath = path.join(__dirname, `../public/protos/${req.ptt.name}`);
    fs.readdir(folderPath, function (err, result) {
        const reg = /index\.html|start_c_1\.html|start_g_0\.html|start\.html/;
        let htmls = result.filter(function (fileName) {
            return fileName.endsWith('.html') && !reg.test(fileName);
        });

        for (const pageName of htmls) {
            viewData.htmlList.push({
                name: pageName,
                url: `/prototypes/${req.ptt.name}/${pageName}?setting=true`
            })
        }
        res.render('newTask', viewData);
    })

}

exports.getPttHtmls = function (req, res) {

}

exports.createTask = function (req, res) {

    // 同名校验
    let verify = req.ptt.tasks.some(function (element) {
        return element.name === req.body.name;
    });
    if (verify) {
        res.status(400).send('任务名称重复');
        return;
    }

    req.ptt.tasks.push(req.body);
    req.ptt.save(function (err, result) {
        if (err) throw err;
        console.log('任务保存成功');
        res.status(201).send();
    });
}

exports.deleteTask = function (req, res) {
    req.ptt.tasks.splice(req.params.taskIndex - 1, 1);
    req.ptt.save(function (err) {
        res.end();
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