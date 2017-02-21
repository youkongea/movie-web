/**
 * Created by unsad on 2017/2/20.
 */
const Movie = require('../models/movie'),
    Comment = require('../models/comment'),
    Category = require('../models/category');

// detail page
exports.detail = function (req, res) {
    const id = req.params.id;
    Movie.findById(id, function (err, movie) {
        Comment
            .find({movie: id})
            .populate('from','name')
            .populate('reply.from reply.to', 'name')
            .exec(function(err, comments) {
            res.render('detail', {
                title: movie.title,
                movie: movie,
                comments: comments
            })
        })
    })
};

//admin new page
exports.new = function (req, res) {
    Category.find({}, function(err, categories) {
        res.render('admin', {
            title: '后台录入页',
            categories: categories,
            movie: {}
        })
    })
};
// admin update movie
exports.update = function (req, res) {
    const id = req.params.id;
    if (id) {
        Movie.findById(id, function (err, movie) {
            Category.find({}, function(err, categories) {
                res.render('admin', {
                    title: 'imooc 后台更新页',
                    movie: movie,
                    categories: categories
              });
            })
        })
    }
};
//admin post movie
exports.save = function (req, res) {
    let id = req.body.movie._id,
        movieObj = req.body.movie,
        _movie;

    if (id) {
        Movie.findOneAndUpdate({_id: id}, movieObj, function (err, movie) {
            if (err) {
                console.log(err);
            }
            res.redirect('/movie/' + movie._id);
        });
    }
    else {
        _movie = new Movie(movieObj);
        let categoryId = _movie.category;
        _movie.save(function (err, movie) {
            if (err) {
                console.log(err);
            }
            Category.findById(categoryId, function(err, category) {
               category.movies.push(_movie._id);
                res.redirect('/movie/' + movie._id);
               })
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