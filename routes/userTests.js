var express = require('express');
var router = express.Router();
var uesrTestController = require('../controllers/userTestController');


// 导航到:新建测试实例
router.post('/', uesrTestController.post);

// 导航到:日志更新
router.patch('/', uesrTestController.patch);

// 导航到:获取下一个测试任务
router.get('/', uesrTestController.getNextTask);

router.delete('/',uesrTestController.del)

module.exports = router;