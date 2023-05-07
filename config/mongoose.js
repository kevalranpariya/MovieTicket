const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1/Movie');

const db = mongoose.connection;

db.once('open',(err)=>{
    if(err)
    {
        return console.log('Database not connected');
    }
    return console.log('Database connected');
});

module.exports = db;