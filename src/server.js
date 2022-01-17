const express = require("express");
const cors = require('cors');
const connect = require("../configs/db");


const passport = require('../configs/passport');
const artistController = require('./Controllers/artist.controller');
const songController = require('./Controllers/songs.controller');
const albumController = require('./Controllers/album.controller')

const app = express();
app.use(cors());

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

const {signin,signup,newToken} =require("./Controllers/auth.controller");

app.use(passport.initialize());
app.use(cors())
passport.serializeUser(function({user,token},done){
    done(null,{user,token})
})

passport.deserializeUser(function({user,token},done){
    done(err,{user,token})
})


app.get("auth/google/failure",function(req,res){
    return res.send("Something went wrong")
})

app.get("/auth/google/success", async function(req,res){
    let user=await admin.findOne().lean().exec();
    console.log(profile);
    let token= newToken(user)
    return res.send({user,token})
})

app.get('/auth/google',
  passport.authenticate('google', { scope:
      [ "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email"
     ] }
));

app.get('/auth/google/callback',
    passport.authenticate( 'google', {
           successRedirect: '/auth/google/success',
        failureRedirect: '/auth/google/failure'
}),function (req,res){
    console.log("user",req.user);
    let user= req.user;
  
  return res.send(user)
});

app.post("/signup",signup);
app.post("/signin",signin);
app.use('/songs',songController);
app.use('/artists',artistController);
app.use('/album',albumController);

app.listen(process.env.PORT||2100,async ()=>{
  let data= await  connect();
    console.log("listening on port 2100")
})