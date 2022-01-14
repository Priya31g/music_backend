const mongoose =require("mongoose");

const songSchema = new mongoose.Schema({
   name:{type:String,required:true},
   duration : {type:String,required:true}
});
module.exports=mongoose.model("songs", songSchema);