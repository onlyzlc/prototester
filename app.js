var createError = require('http-errors');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
// var fileWatcher = require('./fileWatcher_linux');
// fileWatcher.startWatch();

var mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
let connectionOptions = 'mongodb://localhost/prototester';
mongoose.connect(connectionOptions);

var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');
var taskRouter = require('./routes/tasks');

var app = express();
console.log(app.get("env"));
// view engine setup
app.set('views', path.join(__dirname, 'views/pages'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var identitykey = 'skey';
app.use(session({
  key: 'session',
  secret: 'Lonnie',
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  cookie:{
    maxAge: 24*60*60*1000
  }
}));

app.use(express.static(path.join(__dirname, 'public')));

app.all('/*', function (req,res,next) {
  res.set("Access-Control-Allow-Origin","https://axshare.com"); 
  res.set("Access-Control-Allow-Origin","http://zhoulongchun.com"); 
  res.set("Access-Control-Allow-Origin","http://localhost"); 
  res.set("Access-Control-Allow-Methods","*"); 

  let user = req.session.loginUser;
  let isLogined = !!user;
  let reg = /\/login|\/register/;
  // 若已登录，或请求路径为登录或注册时，直接跳过，否则跳转到登录页。
  if(isLogined || reg.test(req.url)){
    console.log("用户：%s 请求: %s",user,req.url);
    next();
  }else{
    
    res.redirect(302,'/login');
    return;
  }
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
