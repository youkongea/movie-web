/**
 * Created by unsad on 2017/2/20.
 */
const Index = require('../app/controllers/index'),
    User = require('../app/controllers/user'),
    Movie = require('../app/controllers/movie'),
    Comment = require('../app/controllers/comment'),
    Category = require('../app/controllers/category');

module.exports = function(app) {
// 预处理user
    app.use(function (req, res, next) {
        let _user = req.session.user;
        app.locals.user = _user;
        return next();
    });

// Index
    app.get('/', Index.index);
// User
    app.post('/user/signup', User.signup);
    app.post('/user/signin', User.signin);
    app.get('/signin', User.showSignin);
    app.get('/signup', User.showSignup);
    app.get('/logout', User.logout);
    app.get('/admin/user/list', User.signinRequired, User.adminRequired, User.list);
    app.get('/admin', User.signinRequired, User.adminRequired, User.admin);
// Movie
    app.get('/movie/:id', Movie.detail);
    app.get('/admin/movie/new', User.signinRequired, User.adminRequired, Movie.new);
    app.get('/admin/movie/update/:id', User.signinRequired, User.adminRequired, Movie.update);
    app.post('/admin/movie', User.signinRequired, User.adminRequired,Movie.savePoster, Movie.save);
    app.get('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.list);
    app.delete('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.del);

//comment
    app.post('/user/comment', User.signinRequired, Comment.save);
// category
    app.get('/admin/category/new', User.signinRequired, User.adminRequired, Category.new);
    app.post('/admin/category', User.signinRequired, User.adminRequired, Category.save);
    app.get('/admin/category/list', User.signinRequired, User.adminRequired, Category.list);
    // results
    app.get('/results', Index.search);
};

