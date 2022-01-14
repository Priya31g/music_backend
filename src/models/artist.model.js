const mongoose =require("mongoose");
const bcrypt = require("bcryptjs");
const artistSchema = new mongoose.Schema({
    name:{ type: String, require: true},
    email:{ type: String, require: true },
    password:{type:String}
});


artistSchema.pre("save",function(next){
    if(!this.isModified("password"))  next();

   const hash= bcrypt.hashSync(this.password,8);
   this.password = hash;
   next();
});

artistSchema.methods.checkPassword = function(password) {
    const match = bcrypt.compareSync(password, this.password);

    return match;
}
module.exports=mongoose.model("artist", artistSchema);