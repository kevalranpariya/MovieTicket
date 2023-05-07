const mongoose = require('mongoose');

const mallSchema = mongoose.Schema({
    name :{
        type : String,
        required :true
    }
});


module.exports = mongoose.model('Mall',mallSchema);