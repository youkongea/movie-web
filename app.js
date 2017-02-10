/**
 * Created by unsad on 2017/2/9.
 */
const express = require("express"),
    port = process.env.PORT || 3000,
    path = require('path'),
    bodyParser = require('body-parser');

const app = express();

app.set('views', './views/pages');
app.set('view engine', 'pug');
app.use('/static', express.static(path.join(__dirname, 'bower_components')));
app.use(bodyParser.urlencoded({extended: true}));
app.listen(port);

console.log('start');

// index page
app.get('/', function(req, res) {
    res.render('index', {
        title: '首页',
        movies: [{
            title: '机械战警',
            _id: 1,
            poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
        },{
            title: '机械战警',
            _id: 2,
            poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
        },{
            title: '机械战警',
            _id: 3,
            poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
        },{
            title: '机械战警',
            _id: 4,
            poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
        },{
            title: '机械战警',
            _id: 5,
            poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
        },{
            title: '机械战警',
            _id: 6,
            poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
        }]
    })
});

//detail page
app.get('/movie/:id', function(req, res) {
    res.render('detail', {
        title: '详情页',
        movie: {
            doctor: '何塞帕迪里亚',
            country: '美国',
            title: '机械战警',
            year: 2014,
            poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5',
            language: '英语',
            flash: 'http://player.youku.com/player.php/sid/XNjA1NjA1Njc0NTUy/v.swf',
            summary: '这里是简介'
        }
    })
});

//admin page
app.get('/admin/movie', function(req, res) {
    res.render('admin', {
        title: '后台录入页',
        movie: {
            title: '',
            doctor: '',
            country: '',
            year: '',
            poster: '',
            flash: '',
            summary: '',
            language: ''
        }
    })
});

//list page
app.get('/admin/list', function(req, res) {
    res.render('list', {
        title: '详情页',
        movies: [{
            title: '机械战警',
            _id: 1,
            doctor: '何塞帕迪里亚',
            country: '美国',
            year: 2014,
            language: '英语',
            flash: 'http://player.youku.com/player.php/sid/XNjA1NjA1Njc0NTUy/v.swf',
            summary: '这里是简介'
        }]
    })
});