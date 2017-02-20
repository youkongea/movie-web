/**
 * Created by unsad on 2017/2/20.
 */
const Movie = require('../models/movie');
// detail page
exports.detail = function (req, res) {
    const id = req.params.id;
    Movie.findById(id, function (err, movie) {
        res.render('detail', {
            title: 'imooc' + movie.title,
            movie: movie
        })
    })
};

//admin new page
exports.new = function (req, res) {
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
};
// admin update movie
exports.update = function (req, res) {
    const id = req.params.id;
    if (id) {
        Movie.findById(id, function (err, movie) {
            if (err) {
                console.log(err);
            }
            res.render('admin', {
                title: 'imooc 后台更新页',
                movie: movie
            })
        })
    }
};
//admin post movie
exports.save = function (req, res) {
    "use strict";
    let id = req.body.movie._id,
        movieObj = req.body.movie,
        _movie;

    if (id !== 'undefined') {
        Movie.findOneAndUpdate({_id: id}, movieObj, function (err, movie) {
            if (err) {
                console.log(err);
            }
            res.redirect('/movie/' + movie._id);
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
        _movie.save(function (err, movie) {
            if (err) {
                console.log(err);
            }
            res.redirect('/movie/' + movie._id);
        });
    }
};


//list page
exports.list = function (req, res) {
    Movie.fetch(function (err, movies) {
        if (err) {
            console.log(err);
        }
        res.render('list', {
            title: '详情页',
            movies: movies
        })
    });
};

//list delete movie
exports.del = function (req, res) {
    "use strict";
    const id = req.query.id;
    if (id) {
        Movie.remove({_id: id}, function (err, movie) {
            if (err) {
                console.log(err);
            }
            else {
                res.json({success: 1});
            }
        })
    }
};