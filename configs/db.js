const mongoose = require('mongoose');

const connect =  ()=>{
    return mongoose.connect("mongodb+srv://MusicProject:Priya31@cluster0.oglys.mongodb.net/test");
}
module.exports = connect;
