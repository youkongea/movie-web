/**
 * Created by unsad on 2017/2/21.
 */
const Comment = require('../models/comment');
//admin post movie
exports.save = function (req, res) {
    let _comment = req.body.comment,
        movieId = _comment.movie,
        comment = new Comment(_comment);

        comment.save(function (err, comment) {
            if (err) {
                console.log(err);
            }
            res.redirect('/movie/' + movieId);
        })
    };


