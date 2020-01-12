var express = require('express');
var router = express.Router();
var pttController = require("../controllers/pttController");

router.get('/', pttController.getAllPtt);
router.get('/new', pttController.getNewPttPage);
router.post('/', pttController.createPtt);

// 获取当前原型
router.all('/:pttId*', pttController.getPtt);

router.get('/:pttId',pttController.getPttPage);

// 废弃
router.get('/:pttId/task/new',pttController.getNewTaskPage);

router.post('/:pttId/task',pttController.createTask);
router.patch('/:pttId/:taskIndex',pttController.updateTask);

router.get('/:pttId/:taskIndex',pttController.getTaskPage);
router.get('/:pttId/:taskIndex/setting',pttController.getTaskSettingPage);
router.get('/:pttId/:taskIndex/setting/steps',pttController.getTaskSettingSteps);
router.get('/:pttId/:taskIndex/data',pttController.getTaskData);
router.delete('/:pttId/:taskIndex',pttController.deleteTask);


module.exports = router;