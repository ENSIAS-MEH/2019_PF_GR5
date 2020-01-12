
const express = require('express');
const categories = require('../routes/categories');
const home = require('../routes/home');
const users = require('../routes/users');
const auth = require('../routes/auth');
const error = require('../middleware/error');

module.exports = function (app){
    app.use(express.json());
    app.use('/api/auth', auth);
    app.use('/api/users', users);
    app.use('/api/categories', categories);
    app.use('/', home);
    app.use(error);
}