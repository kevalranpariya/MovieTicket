const mongoose = require('mongoose');

const mallSchema = mongoose.Schema({
    movieID :{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Movie',
        required :true
    },
    mallID :{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Mall',
        required :true
    }
});


module.exports = mongoose.model('movieOnmall',mallSchema);