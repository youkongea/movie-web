/**
 * Created by unsad on 2017/2/21.
 */
const mongoose = require('mongoose');
const CommentSchema = require('../schemas/comment');
const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;