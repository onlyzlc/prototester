var express = require('express');
var router = express.Router();
var pttController = require("../controllers/pttController");

router.get('/', pttController.getAllPtt);
router.post('/', pttController.createPtt);

router.all('/:pttId*', pttController.getPtt);

router.get('/:pttId',pttController.getPttPage);

// 废弃
router.get('/:pttId/newtask',pttController.getNewTaskPage);

router.post('/:pttId/task',pttController.createTask);
router.patch('/:pttId/:taskIndex',pttController.updateTask);

router.get('/:pttId/:taskIndex',pttController.getTaskPage);
router.get('/:pttId/:taskIndex/data',pttController.getTaskData);
router.delete('/:pttId/:taskIndex',pttController.deleteTask);


module.exports = router;