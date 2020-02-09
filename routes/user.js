var express = require('express');
var router = express.Router();
var userApi = require('../controllers/userController');

/* GET users listing. */
router.post('/register', userApi.register);
router.post('/login', userApi.login);

module.exports = router;
