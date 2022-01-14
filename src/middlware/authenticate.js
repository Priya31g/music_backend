const jwt = require("jsonwebtoken");
require("dotenv").config();




async function authenticate(req,res,next){
const bearerToken = req.headers.authorization;
if(!bearerToken||!bearerToken.startsWith('Bearer ')){
    return res.status(401).send({message: "Please provide bearer token"});
}
const token = bearerToken.split(" ")[1]

try{

    const {user} =await veryfyToken(token);
    req.user=user;
    return next();
}catch(e){
    return res.status(400).send({message: "Please provide a valid bearer token"});
}
}

function veryfyToken(token){
        return new Promise(function(resolve,reject){
        jwt.verify(token,process.env.JWT_SECRET_KEY,function(err,user){
            if(err)return  reject(err);

            return resolve(user)
        });
 })
 
}


module.exports= authenticate;