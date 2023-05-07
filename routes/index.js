const express = require('express');
const frontController = require('../controller/frontController');
const passport = require('passport');
const route = express.Router();

route.get('/', frontController.indexPage);

route.get('/movie/:id', frontController.movieShow);

route.get('/login',frontController.login);

route.post('/userRegister', frontController.userRegister);

route.post('/UserLogin',passport.authenticate('User',{failureRedirect:'/login'}), frontController.UserLogin);

route.get('/deleteCart/:id',passport.checkAuthentication,frontController.deleteCart);

route.get('/bookTicket',passport.checkAuthentication, frontController.bookTicket);

route.get('/search', frontController.search);

route.get('/filter/:type', frontController.filter);

route.get('/seat/:id',passport.checkAuthentication,frontController.seat);

route.post('/userBookSeats',passport.checkAuthentication, frontController.userBookSeats);

route.get('/shows/:id', frontController.shows)

route.use('/admin', require('./adminRouter'));
module.exports = route;