var createError = require('http-errors');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// var test  = require('./test');

var fileWatcher = require('./fileWatcher');
// fileWatcher.startWatch();

var mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb://localhost/prototester' );

var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');
var taskRouter = require('./routes/tasks');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views/pages'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.all('/*', function (req,res,next) {
  res.set("Access-Control-Allow-Origin","https://axshare.com"); 
  res.set("Access-Control-Allow-Origin","http://zhoulongchun.com"); 
  res.set("Access-Control-Allow-Origin","http://localhost"); 
  res.set("Access-Control-Allow-Methods","*"); 
  next();
});

// 路由
app.use('/', indexRouter);
app.use('/user', userRouter);
// app.use('/ptts',pttRouter);
app.use('/tasks',taskRouter)
app.use('/thanks', (req,res)=>{
  res.render('finish');
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// test();


module.exports = app;
