/**
 * Created by unsad on 2017/2/9.
 */
const express = require("express"),
    port = process.env.PORT || 3000,
    path = require('path'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    Movie = require('./models/movie');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/movie');

const app = express();

app.set('views', './views/pages');
app.set('view engine', 'pug');
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.locals.moment = require('moment');
app.listen(port);

console.log('start');

// index page
app.get('/', function(req, res) {
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
//detail page
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