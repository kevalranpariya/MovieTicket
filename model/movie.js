const mongoose = require('mongoose');
const multer = require('multer');
const imgPath = '/img/movie'
const path = require('path');

const movieSchema = mongoose.Schema({
    name :{
        type : String,
        required :true
    },
    release_date :{
        type : Date,
        required :true
    },
    language :{
        type : Array,
        required :true
    },
    runtime:{
        type : String,
        required : true
    },
    imdb :{
        type : String,
        required :true
    },
    genre :{
        type : Array,
        required :true
    },
    thumbnail :{
        type : String,
        requried : true
    },
    picture :{
        type : Array,
        required :true
    },
    description :{
        type : String,
        required :true
    },
    isActive:{
        type : Boolean,
        required : true
    },
    price:{
        type : Number,
        required : true
    }
});

const sto = multer.diskStorage({
    destination :(req,file,cb)=>{
        cb(null,path.join(__dirname,'../asstes/',imgPath));
    },
    filename:(req,file,cb)=>{
        cb(null,file.fieldname+'-'+Date.now());
    }
});

movieSchema.statics.thumbnailUpload = multer({storage:sto}).fields([
    {
        name : 'thumbnail'
    },
    {
        name : 'picture'
    }
]);
movieSchema.statics.thumbnailPath = imgPath;

const Movie = mongoose.model('Movie',movieSchema);

module.exports = Movie;