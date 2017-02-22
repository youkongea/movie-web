/**
 * Created by unsad on 2017/2/20.
 */
const Movie = require('../models/movie'),
    Catetory = require('../models/category');
// index page
exports.index = function (req, res) {
    console.log(req.session.user);
    Catetory
        .find({})
        .populate({path: 'movies', options: {limit: 5}})
        .exec(function(err, categories) {
        if (err) {
            console.log(err);
        }
        res.render('index', {
            title: '首页',
            categories: categories
        })
    });
};
//search page
exports.search = function (req, res) {
    console.log('a');
    let catId = req.query.cat,
        q = req.query.q,
        page = parseInt(req.query.p, 10) || 0,
        count = 2,
        index = page * count;
    if (catId) {
        Catetory
            .find({_id: catId})
            .populate({
                path: 'movies',
                select: 'title poster',
            })
            .exec(function (err, categories) {
                if (err) {
                    console.log(err);
                }
                let category = categories[0] || {},
                    movies = category.movies || [],
                    results = movies.slice(index, index + count);
                res.render('results', {
                    title: '结果列表页面',
                    keyword: category.name,
                    movies: results,
                    currentPage: (page + 1),
                    totalPage: Math.ceil(movies.length / count),
                    query: 'cat=' + catId
                })
            });
    } else {
        Movie
            .find({title: new RegExp(q + '.*', 'i')})
            .exec(function (err, movies) {
                if (err) {
                    console.log(err);
                }
                let results = movies.slice(index, index + count);
                res.render('results', {
                    title: '结果列表页面',
                    keyword: q,
                    movies: results,
                    currentPage: (page + 1),
                    totalPage: Math.ceil(movies.length / count),
                    query: 'q=' + q
                })
            });
    }
};