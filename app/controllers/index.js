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