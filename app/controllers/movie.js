/**
 * Created by unsad on 2017/2/20.
 */
const Movie = require('../models/movie'),
    Comment = require('../models/comment'),
    Category = require('../models/category'),
    fs = require('fs'),
    path = require('path');


// detail page
exports.detail = function (req, res) {
    const id = req.params.id;
    Movie.findById(id, function (err, movie) {
        Movie.update({_id: id}, {$inc: {pv: 1}}, function(err) {
            if (err) {
                console.log(err);
            }
        });
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
//admin poster
exports.savePoster = function(req, res, next) {
    let posterData = req.files.uploadPoster,
        filePath = posterData.path,
        originalFilename = posterData.originalFilename;

    if (originalFilename) {
        fs.readFile(filePath, function(err, data) {
            let timestamp = Date.now(),
                type = posterData.type.split('/')[1],
                poster = timestamp + '.' + type,
                newPath = path.join(_dirname, '../../', '/public/upload'+poster);

                fs.writeFile(newPath, data, function(err) {
                    req.poster = poster;
                    next();
                })
        })
    } else {
        next();
    }
};
//admin post movie
exports.save = function (req, res) {
    let id = req.body.movie._id,
        movieObj = req.body.movie,
        _movie;
    if (req.poster) {
        movieObj.poster = req.poster;
    }
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
        let categoryId = movieObj.category,
            categoryName = movieObj.categoryName;

        _movie.save(function (err, movie) {
            if (err) {
                console.log(err);
            }
            if (categoryId) {
                Category.findById(categoryId, function (err, category) {
                    category.movies.push(movie._id);
                    category.save(function(err, category) {
                        res.redirect('/movie/' + movie._id);
                    })
                })
            } else if (categoryName) {
                let category = new Category({
                    name: categoryName,
                    movies: [movie._id]
                });

                category.save(function(err, category) {
                    movie.category = category._id;
                    movie.save(function(err, movie){
                        res.redirect('/movie/' + movie._id);
                    });
                })
            }
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