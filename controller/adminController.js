const Movie = require('../model/movie');
const Admin = require('../model/admin');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const Mall = require('../model/mall');
const movieOnmall = require('../model/movieOnmall');
const Show = require('../model/show');
const { resourceLimits } = require('worker_threads');

module.exports.indexAdmin = async (req, res) => {
    return res.render('indexAdmin')
}

module.exports.addmovie = async (req, res) => {

    return res.render('addMovie')
}

module.exports.addmovieInsertData = async (req, res) => {
    // console.log(req.body);
    // console.log(req.file)
    // console.log(req.files)
    // let imgArray = []
    // if (req.files?.length) {
    //     for (let imgOf of req.files) {
    //         let imgPathFolder = await Movie.thumbnailPath + '/' + imgOf.filename;
    //         imgArray.push(imgPathFolder);
    //     }
    //     req.body.picture = imgArray;
    //     req.body.isActive = true;
    //     let addMovie = await Movie.create(req.body);
    //     if(addMovie)
    //     {
    //         return res.redirect('back');
    //     }
    //     console.log('Something Wrong');
    //     return res.redirect('back');
    // }
    let pictureScreen = [];


    req.body.thumbnail = Movie.thumbnailPath + '/' + req.files.thumbnail[0].filename;

    let picture = req.files.picture;
    picture.forEach(element => {
        let imgpa = Movie.thumbnailPath + '/' + element.filename;
        pictureScreen.unshift(imgpa);
    });
    req.body.picture = pictureScreen;
    req.body.isActive = true;
    let addMovie = await Movie.create(req.body);

    if (addMovie) {
        return res.redirect('back');
    }
    console.log('Something Wrong')
    return res.redirect('back');
}

module.exports.login = async (req, res) => {
    if (req.isAuthenticated()) {
        if (req.user.role == 'Admin') {
            return res.redirect('/admin')
        }
    }
    return res.render('adminLogin');
}

module.exports.register = async (req, res) => {
    if (req.isAuthenticated()) {
        if (req.user.role == 'Admin') {
            return res.redirect('/admin')
        }
    }
    return res.render('adminRegister')
}

module.exports.addAdminDataInsertForRegister = async (req, res) => {
    let checkAdmin = await Admin.findOne({
        email: req.body.email
    });

    if (!checkAdmin) {
        req.body.password = await bcrypt.hash(req.body.password, 10)
        req.body.role = 'Admin';
        let addAdmin = await Admin.create(req.body);

        if (addAdmin) {
            return res.redirect('/login');
        }
        console.log('Can not add Data');
        return res.redirect('bakc');
    }
    console.log('Another email id try!!')
    return res.redirect('back')
}

module.exports.adminLoginforLoginpage = async (req, res) => {
    return res.redirect('/admin')
}

module.exports.viewMovie = async (req, res) => {
    let page = 1;
    let perpage = 5
    if (req.query.page) {
        page = req.query.page
    }
    let getMovie = await Movie.find({}).skip((page - 1) * perpage)
        .limit(perpage);

    let totalPage = await Movie.find({}).countDocuments()

    return res.render('viewMovie', {
        allMovie: getMovie,
        pagination: Math.ceil(totalPage / perpage)
    })
}

module.exports.movieDeactiveData = async (req, res) => {
    let movieDeactive = await Movie.findByIdAndUpdate(req.params.id, {
        isActive: false
    });

    if (movieDeactive) {
        return res.redirect('back');
    }
    console.log('Something Wrong');
    return res.redirect('back');
}

module.exports.movieActiveData = async (req, res) => {
    let movieActive = await Movie.findByIdAndUpdate(req.params.id, {
        isActive: true
    });

    if (movieActive) {
        return res.redirect('back');
    }
    console.log('Something Wrong');
    return res.redirect('back');
}

module.exports.deleteMovie = async (req, res) => {
    let movieFind = await Movie.findById(req.params.id);

    if (movieFind) {
        if (movieFind.thumbnail || movieFind.picture) {
            fs.unlinkSync(path.join(__dirname, '../asstes', movieFind.thumbnail));
            for (let pic of movieFind.picture) {
                fs.unlinkSync(path.join(__dirname, '../asstes', pic));
            }
        }
        let deleteMovie = await Movie.findByIdAndDelete(req.params.id);
        if (deleteMovie) {
            return res.redirect('back');
        }
        console.log('Something Wrong');
        return res.redirect('back')
    }
    console.log('Movie Not Found');
    return res.redirect('back');
}

module.exports.updateMovie = async (req, res) => {
    let movieFind = await Movie.findById(req.params.id);
    if (movieFind) {
        return res.render('updateMovie', {
            upMovie: movieFind
        })
    }
    console.log('Movie Not Found');
    return res.redirect('back');
}

module.exports.updateMovieData = async (req, res) => {
    if (Object.keys(req.files).length) {
        let movieFind = await Movie.findById(req.body.screctKey);
        console.log(movieFind)
        if (movieFind) {
            console.log('work')
            fs.unlinkSync(path.join(__dirname, '../asstes', movieFind.thumbnail));
            for (let pic of movieFind.picture) {
                fs.unlinkSync(path.join(__dirname, '../asstes', pic));
            }
        }


        let pictureScreen = [];
        req.body.thumbnail = Movie.thumbnailPath + '/' + req.files.thumbnail[0].filename;
        let picture = req.files.picture;
        picture.forEach(element => {
            let imgpa = Movie.thumbnailPath + '/' + element.filename;
            pictureScreen.unshift(imgpa);
        });
        req.body.picture = pictureScreen;

        let updateMovie = await Movie.findByIdAndUpdate(req.body.screctKey, req.body)

        if (updateMovie) {
            return res.redirect('/admin/viewMovie');
        }
        console.log('Can not update Movie');
        return res.redirect('back');
    }
    else {
        let updateMovie = await Movie.findByIdAndUpdate(req.body.screctKey, req.body);
        if (updateMovie) {
            return res.redirect('back');
        }
        console.log('Can not update')
        return res.redirect('back');
    }
}

module.exports.search = async (req, res) => {
    let search = req.query.search;
    let page = 1;
    let perpage = 5
    if (req.query.page) {
        page = req.query.page
    }
    let movieSearch = await Movie.find({
        isActive: true,
        $or: [
            { name: { $regex: '.*' + search + '.*' } }
        ]
    }).skip((page - 1) * perpage)
        .limit(perpage);

    let totalPage = await Movie.find({
        isActive: true,
        $or: [
            { name: { $regex: '.*' + search + '.*' } }
        ]
    }).countDocuments()

    return res.render('adminSearch', {
        result: movieSearch,
        pagination: Math.ceil(totalPage / perpage),
        search: search
    })
}

module.exports.changePassword = async (req, res) => {
    return res.render('changePassword')
}

module.exports.getchangePassword = async (req, res) => {
    let checkAdmin = await Admin.findById(req.user.id);

    if (checkAdmin) {
        let passCheck = await bcrypt.compare(req.body.password, checkAdmin.password);

        if (passCheck) {
            if (req.body.npassword == req.body.cpassword) {
                req.body.password = await bcrypt.hash(req.body.npassword, 10);

                let updatePass = await Admin.findByIdAndUpdate(req.user.id, req.body);
                if (updatePass) {
                    return res.redirect('/admin/login');
                }
                console.log('Not password change')
                return res.redirect('back');
            }
            console.log('New Password & Confirm Passworrd Npt match!!')
            return res.redirect('back');
        }
        console.log('Please Enter Current Password');
        return res.redirect('back');
    }
    console.log('Admin Not Found');
    return res.redirect('/admin/login')
}

module.exports.logout = async (req, res) => {
    req.logout((err) => {
        if (err) {
            console.log('Something Wrong');
            return res.redirect('back');
        }
        return res.redirect('/admin/login');
    })
}

module.exports.forgotPassword = async (req, res) => {
    return res.render('adminForgotPassword')
}

module.exports.mailResetPassword = async (req, res) => {
    checkAdmin = await Admin.findOne({
        email: req.body.email
    });

    if (checkAdmin) {
        var transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "e6b7d6a29ff81a",
                pass: "692e127db25e24"
            }
        });

        let info = await transport.sendMail({
            from: 'keval@gmail.com', // sender address
            to: checkAdmin.email, // list of receivers
            subject: "Password Reset", // Subject line
            text: "Password Forgot", // plain text body
            html: '<h1>Password Reset Link</h1><a href="localhost:4600/admin/passwordResetLink/' + checkAdmin.id + '/?email_vey=true" target="_blank">Click Me</a>', // html body
        });

        return res.end('Check Your Mail AND Click the reset link!!!!');
    }
    else {
        console.log('Can not find email id');
        return res.redirect('back')
    }
}

module.exports.passwordResetLink = async (req, res) => {
    let checkAdmin = await Admin.findById(req.params.id);

    if (checkAdmin) {
        if (req.query.email_vey == 'true') {
            res.cookie('a_id', req.params.id)
            return res.redirect('/admin/passForgot')
        }
        return res.redirect('/admin/forgotPassword');
    }
    return res.redirect('/admin');
}

module.exports.passForgot = async (req, res) => {
    let adminId = req.cookies.a_id
    return res.render('adminReenterPassword', {
        aID: adminId
    })
}

module.exports.newPasswordForAdmin = async (req, res) => {
    if (req.body.npassword == req.body.cpassword) {
        let passHash = await bcrypt.hash(req.body.cpassword, 10)
        let passwordChange = await Admin.findByIdAndUpdate(req.body.aiD, {
            password: passHash
        });
        if (passwordChange) {
            return res.redirect('/admin/login')
        }
        else {
            console.log('Something Wrong')
            return res.redirect('back')
        }
    }
    else {
        console.log('Your New password and confirm password not match!!!');
        return res.redirect('back');
    }
}

module.exports.addMall = async (req, res) => {
    return res.render('addMall')
}

module.exports.addMallInsert = async (req, res) => {
    let addMall = await Mall.create(req.body);

    if (addMall) {
        return res.redirect('back');
    }
    console.log('Can not add Mall');
    return res.redirect('back');
}

module.exports.addMovieonMall = async (req, res) => {
    let getMovie = await Movie.find({
        isActive: true
    });
    let getMall = await Mall.find({});

    return res.render('addMovieonMall', {
        movie: getMovie,
        mall: getMall
    })
}

module.exports.addMovieonMallinsert = async (req, res) => {
    let addMovieonMall = await movieOnmall.create(req.body);

    if (addMovieonMall) {
        return res.redirect('back');
    }
    console.log('Can not add Movie on Mall');
    return res.redirect('back');
}

module.exports.addShow = async (req, res) => {
    let getMovie = await Movie.find({
        isActive: true
    });
    return res.render('addShow', {
        movie: getMovie
    })
}

module.exports.passOutmovieDetail = async (req, res) => {
    let findMall = await movieOnmall.find({
        movieID: req.body.movieID
    }).populate('mallID').exec();

    return res.render('mallopt', {
        mall: findMall
    });
}

module.exports.addShowinMall = async (req, res) => {
    let findShow = await Show.find({
        $and: [
            { movieID: req.body.movieID },
            { mallID: req.body.mallID }
        ]
    });

    if (findShow?.length) {
        let addShow = await Show.findByIdAndUpdate(findShow[0].id, {
            $push: {
                time: req.body.time
            }
        });

        if (addShow) {
            return res.redirect('back');
        }
        console.log('Can not add time');
        return res.redirect('back')
    }
    else {
        let createShow = await Show.create(req.body);

        if (createShow) {
            return res.redirect('back');
        }
        console.log('Can not add');
        return res.redirect('back');
    }
}