const jwt = require("jsonwebtoken");
require("dotenv").config();
const admin = require("../models/artist.model");

const newToken = (user)=>{
    return jwt.sign({user},'masaischool')
}

const signup =async (req,res)=>{
    let user;
      try{
         
         user = await admin.findOne({email:req.body.email})
                     
          if(user)
          return res.status(201).send({message: "Email is already registered."});
         
         
          user =await admin.create(req.body);
          const token = newToken(user);
         return res.status(201).send({user,token})


        }catch(e){
         return res.status(500).json({status:"failed",message:"Something Went Wrong"})
        }
}


const signin =async (req,res)=>{
    try{
    
        let user = await admin.findOne({email:req.body.email});
        if(! user)    return res.status(401).send({message: "Please check email or password"});
        console.log(user)
        let match=user.checkPassword(req.body.password);
        if(! match){
            return res.status(401).send({message: "Plese check email or password"});
        }
        const token =newToken(user)
        return res.status(200).send({user,token});
    }
    catch(e){
        return res.status(500).json({status:"failed",message:"Something Went Wrong"})
    }
  
}


module.exports={
    signup,
    signin,
    newToken
}