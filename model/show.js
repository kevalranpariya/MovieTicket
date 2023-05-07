const mongoose = require('mongoose');

const showSchema = mongoose.Schema({
    movieID :{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Movie',
        required :true
    },
    mallID :{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Mall',
        required :true
    },
    time :{
        type : [],
        required : true
    }
});


module.exports = mongoose.model('Show',showSchema);