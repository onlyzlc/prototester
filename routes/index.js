const express = require('express');
var Ptt = require('../models/model_ptt');
var router = express.Router();

router.get('/', function (req, res, next) {
  
  console.log('到首页');
  
});

module.exports = router;