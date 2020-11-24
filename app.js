var createError = require('http-errors');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var history = require('connect-history-api-fallback');
var indexRouter = require('./routes/index');

var app = express();

const ENV = app.get("env");
console.log(ENV);
global.DEBUG = (ENV.startsWith('development'))

// var fileWatcher = require('./fileWatcher_linux');
// fileWatcher.startWatch();

//////// 配置数据库连接 ////////
var mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
// 开发环境调用远程数据库, 
// let connectionOptions = (process.env.NODE_ENV == 'development') ? "mongodb+srv://sodar:zlc-7895123@moonsea.8ucon.azure.mongodb.net/prototester?retryWrites=true&w=majority" : 'mongodb://localhost/prototester';
let connectionOptions
switch(ENV){
  case 'development1' :
    connectionOptions = "mongodb+srv://sodar:zlc-7895123@moonsea.8ucon.azure.mongodb.net/prototester?retryWrites=true&w=majority"
    break
  case 'development':
    connectionOptions = 'mongodb://localhost/prototester'
    break
  default:
    connectionOptions = 'mongodb://localhost/prototester'
}
mongoose.connect(connectionOptions);
const cnt = mongoose.connection;
cnt.on('connected',function () {
  if(global.DEBUG) console.log('数据库连接成功');
}).on('error', function () {
  throw '数据库连接失败'
})

//////// 配置后端视图模板(暂时没用) //////// 
// view engine setup
app.set('views', path.join(__dirname, 'views/pages'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(history());

// 配置会话存储
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var identitykey = 'skey';
app.use(session({
  key: 'session',
  secret: 'Lonnie',
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  cookie: {
    maxAge: 60 * 60 * 1000 // 1小时登录失效
  },
  saveUninitialized: false,
  rolling: true,
  resave: false
}));

app.use(express.static(path.join(__dirname, 'public')));

// 中间件:响应头设置
app.use('/', (req, res, next) => {
  // res.set("Access-Control-Allow-Origin", "https://axshare.com");
  // res.set("Access-Control-Allow-Origin", "http://zhoulongchun.com");
  // res.set("Access-Control-Allow-Origin", "http://localhost");
  // res.set("Access-Control-Allow-Origin", "http://localhost:8080"); 
  res.set("Access-Control-Allow-Methods", "*");
  next();
});

// 路由
app.use('/api', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  console.error(err.message);

  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
