/**
 * Created by unsad on 2017/2/20.
 */
const User = require('../models/user');
// signup
exports.showSignup = function (req, res) {
        res.render('signup', {
            title: '注册'
        })
    };

exports.showSignin = function (req, res) {
    res.render('signin', {
        title: '登录'
    })
};

exports.signup = function (req, res) {
    let _user = req.body.user;

    User.findOne({name: _user.name}, function (err, user) {
        if (err) {
            console.log(err);
        }
        if (user) {
            return res.redirect('/signin');
        }
        else {
            let user = new User(_user);
            user.save(function (err, user) {
                if (err) {
                    console.log(err);
                }
                res.redirect('/');
            })
        }
    });
};
// signin
exports.signin = function (req, res) {
    let _user = req.body.user,
        name = _user.name,
        password = _user.password;

    User.findOne({name: name}, function (err, user) {
        if (err) {
            console.log(err);
        }
        if (!user) {
            console.log('not found');
            return res.redirect('/signup')
        }
        user.comparePassword(password, function (err, isMatch) {
            if (err) {
                console.log(err);
            }
            if (isMatch) {
                console.log('Password is matched');
                req.session.user = user;
                return res.redirect('/');
            }
            else {
                console.log('Password is not matched');
                return res.redirect('/signin');
            }
        });
    })
};
// logout
exports.logout = function (req, res) {
    delete req.session.user;
    res.redirect('/');
};
//userlist page
exports.list = function (req, res) {
    User.fetch(function (err, users) {
        if (err) {
            console.log(err);
        }
        res.render('userlist', {
            title: '用户列表页',
            users: users
        })
    });
};

//登录权限控制
exports.signinRequired = function(req, res, next) {
    const user = req.session.user;
    if (!user) {
        return res.redirect('/signin');
    }
    next();
};

//管理权限控制
exports.adminRequired = function(req, res, next) {
    const user = req.session.user;
    if (user.role <= 10) {
        return res.redirect('/signin');
    }
    next();
};