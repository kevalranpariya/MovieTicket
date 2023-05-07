const passport = require('passport');

const localStrategy = require('passport-local').Strategy;

const Admin = require('../model/admin');
const bcrypt = require('bcrypt');

passport.use('Admin', new localStrategy({
    usernameField: 'email'
}, async (email, password, done) => {
    let checkAdmin = await Admin.findOne({
        email: email
    });
    if (checkAdmin) {
        const pass = await bcrypt.compare(password, checkAdmin.password)
        if (pass) {
            return done(null, checkAdmin)
        }
        console.log('Password Incorrect!!');
        return done(null, false);
    }
    console.log('User not found')
    return done(null, false);
}));




passport.checkAuthenticationAdmin = (req,res,next)=>{
    if(req.isAuthenticated())
    {
        if(req.user.role == 'Admin'){
            return next();
        }
        return res.redirect('/admin/login');
    }
    return res.redirect('/admin/login');
}

passport.setAuthentication = (req,res,next)=>{
    if(req.isAuthenticated()){
        if(req.user.role == 'Admin')
        {
            res.locals.admin = req.user
        }
    }
    next();
}

module.exports = passport;