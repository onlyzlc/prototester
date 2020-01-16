var express = require('express');
var router = express.Router();
var task = require('../controllers/taskController')

// 废弃
router.get('/:pttId/newtask',task.getNewTaskPage);

router.post('/',task.create);
router.patch('/taskId',task.update);
router.get('/taskId',task.getDetail);
router.get('/taskId/setting',task.getSettingPage);
router.get('/taskId/steps', task.getSteps);
router.delete('/taskId',task.delete);

module.exports = router;