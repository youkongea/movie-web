/**
 * Created by unsad on 2017/2/21.
 */
const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;

const CommentSchema = new mongoose.Schema({
    movie: {type: ObjectId, ref: 'Movie'},
    from: {type: ObjectId, ref: 'User'},
    to: {type: ObjectId, ref: 'User'},
    content: String,
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
});

CommentSchema.pre('save', function(next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now()
    } else {
        this.meta.updateAt = Date.now()
    }
    next()
});

CommentSchema.statics = {
    fetch: function(cb) {
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb)
    },
    findById: function(id, cb) {
        return this
            .findOne({_id: id})
            .sort('meta.updateAt')
            .exec(cb)
    }
};

module.exports = CommentSchema;

