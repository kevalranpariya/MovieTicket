const passport = require('passport');

const localStrategy = require('passport-local').Strategy;

const User = require('../model/user');
const Admin = require('../model/admin');
const bcrypt = require('bcrypt');

passport.use('User', new localStrategy({
    usernameField: 'email'
}, async (email, password, done) => {
    let checkUser = await User.findOne({
        email: email
    });
    if (checkUser) {
        const pass = await bcrypt.compare(password, checkUser.password)
        if (pass) {
            return done(null, checkUser)
        }
        console.log('Password Incorrect!!');
        return done(null, false);
    }
    console.log('User not found')
    return done(null, false);
}));

passport.serializeUser(async(user,done)=>{
    return done(null,user.id);
})

passport.deserializeUser(async(id,done)=>{
    let checkUser= await User.findById(id);
    let checkAdmin = await Admin.findById(id)

    if(checkUser?.role == 'User')
    {
        return done(null,checkUser);
    }
    else if(checkAdmin?.role == 'Admin')
    {
        return done(null,checkAdmin)
    }
    return done(null,false);
});


passport.checkAuthentication = (req,res,next)=>{
    if(req.isAuthenticated())
    {
        if(req.user.role == 'User'){
            return next();
        }
        return res.redirect('/login')
    }
    return res.redirect('/login');
}

module.exports = passport;