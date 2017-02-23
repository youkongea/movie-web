const mongoose = require('mongoose'),
    bcrypt = require('bcrypt-nodejs'), // 密码加盐模块
    SALT_WORK_FACTOR = 10;

const UserSchema = new mongoose.Schema({
    name: {
        unique: true,
        type: String
    },
    password: String,
    //0: normal
    //1: verified
    role: {
        type: Number,
        default: 0
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

// 前置数据存储中间件
UserSchema.pre('save', function(next) {
    const user = this;
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now()
    } else {
        this.meta.updateAt = Date.now()
    }

    // 密码加盐
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
        if (err) {
            return next(err)
        }
        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if (err) {
                return next(err);
            }
            user.password = hash;
            next();
        })
    });
});

// 添加提出和查询静态方法
UserSchema.statics = {
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

// 密码验证实例方法
UserSchema.methods = {
    comparePassword: function(_password, cb) {
        bcrypt.compare(_password, this.password, function(err, isMatch){
            if (err) return cb(err);
            cb(null, isMatch);
        })
    }
};

module.exports = UserSchema;

