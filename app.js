/**
 * Created by unsad on 2017/2/9.
 */
const express = require("express"),
    port = process.env.PORT || 3000,
    path = require('path'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    session = require('express-session'),
    morgan = require('morgan'),
    mongoStore = require('connect-mongo')(session),
    dbUrl = 'mongodb://localhost:27017/movie';

mongoose.Promise = global.Promise;
mongoose.connect(dbUrl);

const app = express();

app.set('views', './app/views/pages');
app.set('view engine', 'pug');
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(session({
    secret: 'movie',
    store: new mongoStore({
        url: dbUrl,
        collection: 'sessions'
    }),
    resave: false,
    saveUninitialized: true
}));

if ('development' === app.get('env')) {
    app.set('showStackError', true);
    app.use(morgan(':method: url :status'));
    app.locals.pretty = true;
    mongoose.set('debug', true);
}

require('./config/routes')(app);

app.locals.moment = require('moment');
app.listen(port);

console.log('start');

