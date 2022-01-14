const mongoose =require("mongoose");
const albumSchema = new mongoose.Schema({
    name:{type:mongoose.Schema.Types.ObjectId,ref:'artist',required:true},
    genre:{type:String,required:true},
    year:{type:String,required:true},
    songs:[{type:mongoose.Schema.Types.ObjectId,ref:'songs',required:true}],
    cover_photo:{type:String},
    logo_artist:String
});
module.exports=mongoose.model("album", albumSchema);