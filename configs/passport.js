const passport=require("passport")
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
require("dotenv").config();
const {v4:uuidv4}=require("uuid");




const admin=require("../src/models/artist.model")
const {newToken} = require("../src/Controllers/auth.controller")



passport.use(new GoogleStrategy({
    clientID:`453861975001-nggoq81umaum21gh85e7t5ocbc7hppki.apps.googleusercontent.com`,
    clientSecret:`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`,
    callbackURL: "http://localhost:2100/auth/google/callback",
    // userProfileURL:"",
    // passReqToCallback   : true
  },

 async function(request, accessToken, refreshToken, profile, done) {
const name = profile?._json?.name;
const email= profile?._json?.email;
console.log(email,name)
let user;
try{
    user = await admin.findOne({email}).lean().exec();
if(!user){
    
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(re.test(email)){
           
            
                user=await admin.create({
                    name:name,
                    email:email,
                    password:uuidv4()
                })
           
       
       
    }
   
}
const token = newToken(user);
console.log(user,token)
if(user!==null)
return done(null,{user,token})
else
return done(null,"sorry! Something went wrong 😢");
}
catch(err){
console.log(err)
}
 }
    
));

module.exports=passport;