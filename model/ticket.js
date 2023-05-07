const mongoose = require('mongoose');

const ticketSchema = mongoose.Schema({
    showID :{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Show',
        required : true
    },
    userID :{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    ticket : {
        type : Array,
        required : true
    },
    time : {
        type : String,
        required : true
    }
});

module.exports = mongoose.model('Ticket',ticketSchema);