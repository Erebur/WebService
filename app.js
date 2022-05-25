var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouter = require('./routes/order');
const con = require("./objects/DBconnection");
var cors = require('cors')


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())


global.repairQuery = function (sqlQuery) {
    return JSON.parse(JSON.stringify(sqlQuery));
}
global.checktoken = async function (token) {
    return new Promise((resolve, reject) => {
        con.query('select UNIX_TIMESTAMP(expiration_date) ed from `Users` where  API_TOKEN = ?', [token], (error, result) => resolve(
            (repairQuery(result)[0] && new Date(repairQuery(result)[0]["ed"] * 1000).getTime() > Date.now())
        ))
    })
}


app.use('/', indexRouter);
app.use('/api/user', usersRouter);
app.use('/api', apiRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    console.log(err)
    // render the error page
    res.status(err.status || 500);
    // console.log(res);
    res.render('error');
});

module.exports = app;
