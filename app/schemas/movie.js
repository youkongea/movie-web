/**
 * Created by unsad on 2017/2/13.
 */
const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;

const MovieSchema = new Schema({
    doctor: String,
    title: String,
    language: String,
    country: String,
    flash: String,
    poster: String,
    summary: String,
    year: Number,
    category: {
        type: ObjectId,
        ref: 'Category'
    },
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

MovieSchema.pre('save', function(next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now()
    } else {
        this.meta.updateAt = Date.now()
    }
    next()
});

MovieSchema.statics = {
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

module.exports = MovieSchema;

