var express = require('express');
var router = express.Router();
var taskApi = require('../controllers/taskController')
var Task = require('../models/model_task');

// 获取用户的任务数据
router.get('/',taskApi.getTasks)

router.get('/newTask', function(req,res){
    console.log("进入添加任务页");
    // res.render('newTask');
})

router.post('/',taskApi.create);

router.get('/:taskId',taskApi.getDetail);
router.delete('/:taskId',taskApi.deleteTask);
router.get('/:taskId/steps', taskApi.getSteps);
router.patch('/:taskId/steps',taskApi.updateSteps);
router.patch('/:taskId/status',taskApi.updateStatus);

router.get('/:taskId/setting',taskApi.getTaskSettingPage);

router.get('/:taskId/testing',taskApi.getTestingPage);
router.patch('/:taskId/testing',taskApi.updateTesting);

router.get('/:taskId/taskNote',taskApi.getTaskNote);

module.exports = router;