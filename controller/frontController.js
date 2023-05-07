const Movie = require('../model/movie');
const User = require('../model/user');
const Ticket = require('../model/ticket');
const Show = require('../model/show')
const bcrypt = require('bcrypt');

module.exports.indexPage = async (req, res) => {
    let page = 1;
    let perpage = 5;
    if (req.query.page) {
        page = req.query.page
    }
    let allMovie = await Movie.find({
        isActive: true
    }).skip((page - 1) * perpage)
        .limit(perpage);

    let movieCount = await Movie.find({
        isActive: true
    }).countDocuments()

    return res.render('index', {
        getMovie: allMovie,
        pagination: Math.ceil(movieCount / perpage)
    });
}


module.exports.movieShow = async (req, res) => {
    const allMovie = await Movie.find({
        isActive : true
    });
    getMovie = await Movie.findById(req.params.id);

    const receMov = allMovie.slice(allMovie.length-3);


    return res.render('showMovie', {
        data: getMovie,
        rec : receMov
    })
}

module.exports.login = async (req, res) => {
    if(req.isAuthenticated()){
        if(req.user.role == 'User')
        {
            return res.redirect('/')
        }
    }
    return res.render('customerLogin')
}

module.exports.userRegister = async (req, res) => {
    let checkUser = await User.findOne({
        email: req.body.email
    })
    if (!checkUser) {
        if (req.body.password == req.body.cpassword) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
            req.body.role = 'User'

            let addUser = await User.create(req.body);

            if (addUser) {
                return res.redirect('/login');
            }
            console.log('Something Wrong');
            return res.redirect('back');
        }
    }
    console.log('Diffrent Email id try!!!')
    return res.redirect('back');
}

module.exports.UserLogin = async (req, res) => {
    return res.redirect('/');
}

module.exports.gotTOcart = async (req, res) => {

    checkMovie = await Movie.findById(req.params.id);
    if (checkMovie) {
        let userCart = await User.findByIdAndUpdate(req.user.id, {
            $push: {
                cart: checkMovie.id
            }
        });

        if (userCart) {
            return res.redirect('/cart');
        }
        console.log('Something Wrong');
        return res.redirect('back')
    }
    console.log('Can not find movie');
    return res.redirect('back');
}

module.exports.cart = async (req, res) => {
    let checkCart = await User.findById(req.user.id).populate('cart');
    if (checkCart) {
        return res.render('cart', {
            cartMovie: checkCart.cart
        });
    }
    console.log('Can not find user');
    return res.redirect('/login')
}

module.exports.deleteCart = async (req, res) => {
    let checkCart = await User.findById(req.user.id);
    console.log(checkCart)
    if (checkCart) {
        let updateCart = await User.findByIdAndUpdate(checkCart.id, {
            $pull: {
                cart: req.params.id
            }
        });

        if (updateCart) {
            return res.redirect('back');
        }
        console.log('Can not delete');
        return res.redirect('back');
    }
    console.log('Can not find User');
    return res.redirect('/login');
}

module.exports.bookTicket = async (req, res) => {
    let checkUser = await User.findById(req.user.id)

    if (checkUser) {
        let updateCart = await User.findByIdAndUpdate(checkUser.id, {
            cart: []
        })
        console.log('Thank you for ticket booking!!!');
        return res.redirect('/');
    }
    console.log('Can not find User');
    return res.redirect('/login')
}

module.exports.search = async (req, res) => {

    let search = req.query.s
    let page = 1;
    if(req.query.page)
    {
        page = req.query.page
    }
    let perpage = 5;
    let checkMovie = await Movie.find({
        isActive: true,
        $or: [
            { name: { $regex: '.*' + search + '.*' } }
        ]
    }).skip((page - 1) * perpage)
        .limit(perpage);

    let movieCount = await Movie.find({
        isActive: true,
        $or: [
            { name: { $regex: '.*' + search + '.*' } }
        ]
    }).countDocuments();

    return res.render('userSearch', {
        search: checkMovie,
        pagination: Math.ceil(movieCount / perpage),
        sea: search
    })
}

module.exports.filter = async(req,res)=>{
    let page = 1;
    let perpage = 5;

    if(req.query.page)
    {
        page = req.query.page
    }

    let getMovie = await Movie.find({
        isActive : true,
        $or :[
            {genre:{
                "$in" :[req.params.type]
            }},
            {language :{
                "$in":[req.params.type]
            }}
        ]
    }).skip((page-1)*perpage).limit(perpage);

    const movieCount = await Movie.find({
        isActive : true,
        $or :[
            {genre:{
                "$in" :[req.params.type]
            }},
            {language :{
                "$in":[req.params.type]
            }}
        ]
    }).countDocuments()

    if(getMovie)
    {
        return res.render('genre',{
            gMovie : getMovie,
            pagination : Math.ceil(movieCount/perpage)
        });
    }
}

module.exports.seat = async(req,res)=>{
    let findShow = await Show.findById(req.params.id).populate('movieID').exec();
    let seatBook = await Ticket.find({
        $and :[
            {showID : req.params.id},
            {time : req.query.time}
        ]
    });
    if(findShow)
    {
        let findTime = findShow.time.forEach(e=>{
            if(e == req.query.time)
            {
                return res.render('seatMovie',{
                        data : findShow,
                        time : req.query.time,
                        seat : seatBook
                });
            }
        })
        return
    }
    console.log('can not find show')
    return res.redirect('back');
    
}

module.exports.userBookSeats = async(req,res)=>{
    req.body.userID = req.user.id;

    let letTicket = await Ticket.create(req.body);

    if(letTicket)
    {
        let userTicket = await User.findByIdAndUpdate(req.user.id, {
            $push: {
                ticket: letTicket.id
            }
        });
        if(userTicket)
        {
            return res.redirect('/');
        }
        console.log('Can not book ticket');
        return res.redirect('back');
    }
    console.log('Can not book ticket');
    return res.redirect('back');
}

module.exports.shows = async(req,res)=>{
    let findMovie = await Show.find({
        movieID : req.params.id
    }).populate('mallID').exec();

    return res.render('froMovieShow',{
        allShows : findMovie
    })
}