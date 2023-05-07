const express = require('express');
const path = require('path');
const server = express();

const mongoose = require('./config/mongoose');
server.use(express.urlencoded())
server.set('view engine','ejs');
server.use(express.static('asstes'));

const passport = require('passport');
const userPassport = require('./config/passport-user');
const adminPassport = require('./config/passport-admin');
const session = require('express-session');
const cookieParser = require('cookie-parser');

server.use(cookieParser());
server.use(session({
    name : 'User',
    secret : 'Use',
    saveUninitialized : false,
    resave : true,
    cookie:{
        maxAge:10*100*10000
    }
}));

server.use(passport.initialize())
server.use(passport.session());
server.use(passport.setAuthentication);

server.use('/',require('./routes/index'))

server.listen(4600,(err)=>{
    if(err)
    {
        console.log('Server not responding');
        return false
    }
    console.log('Server Responding');
})