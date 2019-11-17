var express = require('express');
var router = express.Router();
var pttController = require("../controllers/pttController");


router.get('/', pttController.getAllPtt);
router.all('/:ptt*', pttController.getPtt);
router.get('/:ptt',pttController.getPttPage);
router.get('/:ptt/newtask',pttController.getNewTaskPage);
router.post('/:ptt/newtask',pttController.createTask);
router.get('/:ptt/:taskIndex',pttController.getTaskPage);
router.get('/:ptt/:taskIndex/data',pttController.getTaskData);
router.delete('/:ptt/:taskIndex',pttController.deleteTask);


module.exports = router;