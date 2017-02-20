/**
 * Created by unsad on 2017/2/20.
 */
const Movie = require('../models/movie');
// index page
exports.index = function (req, res) {
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
};