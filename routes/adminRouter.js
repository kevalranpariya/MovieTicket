const express = require('express');
const Movie = require('../model/movie');
const adminController = require('../controller/adminController');
const passport = require('passport');

const route = express.Router();

route.get('/',passport.checkAuthenticationAdmin,adminController.indexAdmin);

route.get('/addmovie',passport.checkAuthenticationAdmin, adminController.addmovie);

route.get('/login', adminController.login);

route.get('/register', adminController.register);

route.post('/addAdminDataInsertForRegister', adminController.addAdminDataInsertForRegister);

route.post('/adminLoginforLoginpage',passport.authenticate('Admin',{failureRedirect : '/admin/login'}), adminController.adminLoginforLoginpage);

route.post('/addmovieInsertData',passport.checkAuthenticationAdmin,Movie.thumbnailUpload, adminController.addmovieInsertData);

route.get('/viewMovie',passport.checkAuthenticationAdmin, adminController.viewMovie);

route.get('/movieDeactiveData/:id',passport.checkAuthenticationAdmin,adminController.movieDeactiveData);

route.get('/movieActiveData/:id',passport.checkAuthenticationAdmin, adminController.movieActiveData);

route.get('/deleteMovie/:id',passport.checkAuthenticationAdmin,adminController.deleteMovie);

route.get('/updateMovie/:id', passport.checkAuthenticationAdmin,adminController.updateMovie);

route.post('/updateMovieData',passport.checkAuthenticationAdmin,Movie.thumbnailUpload, adminController.updateMovieData);

route.get('/search',passport.checkAuthenticationAdmin, adminController.search);

route.get('/changePassword',passport.checkAuthenticationAdmin, adminController.changePassword);

route.post('/getchangePassword',passport.checkAuthenticationAdmin, adminController.getchangePassword);

route.get('/logout',passport.checkAuthenticationAdmin, adminController.logout);

route.get('/forgotPassword', adminController.forgotPassword);

route.post('/mailResetPassword', adminController.mailResetPassword);

route.get('/passwordResetLink/:id',adminController.passwordResetLink);

route.get('/passForgot', adminController.passForgot);

route.post('/newPasswordForAdmin', adminController.newPasswordForAdmin);

route.get('/addMall', adminController.addMall);

route.post('/addMallInsert', adminController.addMallInsert);

route.get('/addMovieonMall',adminController.addMovieonMall);

route.post('/addMovieonMallinsert', adminController.addMovieonMallinsert);

route.get('/addShow',adminController.addShow);

route.post('/passOutmovieDetail', adminController.passOutmovieDetail)

route.post('/addShowinMall',adminController.addShowinMall);

module.exports = route;