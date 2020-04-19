var express = require('express');
var router = express.Router();
var userApi = require('../controllers/userController');

/* GET users listing. */
router.get('/myProtos',userApi.getProtos);

module.exports = router;
