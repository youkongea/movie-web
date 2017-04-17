/**
 * Created by unsad on 2017/2/9.
 */
const express = require("express"),
    port = process.env.PORT || 3000,
    path = require('path'),
    bodyParser = require('body-parser'), // 解析http请求体的中间件
    mongoose = require('mongoose'),
    session = require('express-session'), // 保持会话信息的中间件
    morgan = require('morgan'),  // 记录日志的中间件
    fs = require('fs'), // 文件读取模块
    mongoStore = require('connect-mongo')(session), // 数据库连接的中间件
    dbUrl = 'mongodb://localhost:27017/movie';

mongoose.Promise = global.Promise; // 手动修改mongoose的promise
mongoose.connect(dbUrl);

// 遍历加载models
let models_path = __dirname + '/app/models',
    walk = function(path) {
    fs.readdirSync(path)
        .forEach(function(file) {
            let newPath = path +'/' +file,
                stat = fs.statSync(newPath); //判断文件或目录

            if (stat.isFile()) {
                if (/(.*)\.(js|coffee)/.test(file)) {
                    require(newPath);
                }
            }
            else if (stat.isDirectory()) {
                walk(newPath);
            }
        })
    };
walk(models_path);

const app = express();

// 设置模板引擎和渲染视图位置
app.set('views', './app/views/pages');
app.set('view engine', 'pug');

// 中间件配置按顺序处理
app.use('/static', express.static(path.join(__dirname, 'public'))); // 静态资源托管
app.use(bodyParser.urlencoded({extended: true})); // 解析表单数据
app.use(bodyParser.json()); // 解析json格式数据
app.use(require('connect-multiparty')()); // 文件上传模块
app.use(session({
    secret: 'movie',  // 计算hash
    store: new mongoStore({    // 设置存储方式，默认为内存
        url: dbUrl,
        collection: 'sessions'
    }),
    resave: false,
    saveUninitialized: true
}));

let env = process.env.NODE_ENV || 'development'; // 开发环境相关处理
if ('development' === env) {
    app.set('showStackError', true);
    app.use(morgan(':method :url :status'));
    app.locals.pretty = true;  // 贯穿程序整个生命周期的对象属性设置 格式化输出html
    mongoose.set('debug', true);
}

require('./config/routes')(app);  // 路由配置引用

app.locals.moment = require('moment'); //格式化日期
app.listen(port);

console.log('start at 3000');

