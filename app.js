/**
 * Created by unsad on 2017/2/9.
 */
const express = require("express"),
    port = process.env.PORT || 3000,
    path = require('path'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    Movie = require('./models/movie'),
    User = require('./models/user'),
    session = require('express-session'),
    mongoStore = require('connect-mongo')(session),
    dbUrl = 'mongodb://localhost:27017/movie';

mongoose.Promise = global.Promise;
mongoose.connect(dbUrl);

const app = express();

app.set('views', './views/pages');
app.set('view engine', 'pug');
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(session({
    secret: 'movie',
    store: new mongoStore({
        url: dbUrl,
        collection: 'sessions'
    }),
    resave: false,
    saveUninitialized: true
}));
app.locals.moment = require('moment');
app.listen(port);

console.log('start');

// index page
app.get('/', function(req, res) {
    console.log(req.session.user);
    Movie.fetch(function (err, movies) {
        if (err) {
            console.log(err);
        }
        res.render('index', {
            title: '首页',
            movies: movies
        })
    });
});

// signup
app.post('/user/signup', function(req, res){
    'use strict';
    let _user = req.body.user;

    User.findOne({name: _user.name}, function(err, user){
        if (err) {
            console.log(err);
        }
        if (user) {
            return res.redirect('/');
        }
        else {
           let user = new User(_user);
            user.save(function(err, user) {
                if (err) {
                    console.log(err);
                }
                res.redirect('/admin/userlist');
            })
        }
    });

});
// signin
app.post('/user/signin', function(req, res) {
    "use strict";
    let _user = req.body.user,
        name = _user.name,
        password = _user.password;

    User.findOne({name: name}, function(err, user){
        if (err) {
            console.log(err);
        }
        if (!user) {
            console.log('not found');
            return res.redirect('/')
        }
        user.comparePassword(password, function(err, isMatch){
            if (err) {
                console.log(err);
            }
            if (isMatch) {
                console.log('Password is matched');
                req.session.user = user;
                return res.redirect('/');
            }
            else {
                console.log('Password is not matched');
            }
        });
    })
});
//userlist page
app.get('/admin/userlist', function(req, res) {
    User.fetch(function (err, users) {
        if (err) {
            console.log(err);
        }
        res.render('userlist', {
            title: '用户列表页',
            users: users
        })
    });
});
// detail page
app.get('/movie/:id', function(req, res) {
    const id = req.params.id;
    Movie.findById(id, function(err, movie) {
        res.render('detail', {
            title: 'imooc' + movie.title,
            movie: movie
        })
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
// admin update movie
app.get('/admin/update/:id', function(req, res) {
    const id = req.params.id;

    if (id) {
        Movie.findById(id, function(err, movie) {
            if (err) {
                console.log(err);
            }
            res.render('admin', {
                title: 'imooc 后台更新页',
                movie: movie
            })
        })
    }
});
//admin post movie
app.post('/admin/movie/new', function(req, res) {
    "use strict";
    let id = req.body.movie._id,
        movieObj = req.body.movie,
        _movie;

    if (id !== 'undefined') {
            Movie.findOneAndUpdate({_id: id}, movieObj, function (err, movie){
                if(err){
                    console.log(err);
                }
                res.redirect('/movie/'+movie._id);
            });
    }
    else {
        _movie = new Movie({
            doctor: movieObj.doctor,
            title: movieObj.title,
            country: movieObj.country,
            language: movieObj.language,
            year: movieObj.year,
            poster: movieObj.poster,
            summary: movieObj.summary,
            flash: movieObj.flash
        });
            _movie.save(function(err, movie) {
            if(err){
                console.log(err);
            }
            res.redirect('/movie/'+movie._id);
        });
    }
});


//list page
app.get('/admin/list', function(req, res) {
    Movie.fetch(function (err, movies) {
        if (err) {
            console.log(err);
        }
        res.render('list', {
            title: '详情页',
            movies: movies
        })
    });
});

//list delete movie
app.delete('/admin/list', function(req, res) {
    "use strict";
    const id = req.query.id;
    if (id) {
        Movie.remove({_id: id}, function(err, movie) {
            if (err) {
                console.log(err);
            }
            else {
                res.json({success: 1});
            }
        })
    }
});