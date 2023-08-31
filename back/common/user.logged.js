const User = require("../models/user");
const jwt = require("jsonwebtoken");

async function getUserLogged(req) {
  const { token } = req.cookies;
  if(!token){
    return {status:401,message:"Invalid token! Please login!"};
  }
  let verify = null;
  try{
    verify = await jwt.verify(token, process.env.SECRET_KEY);
  } catch (err) {
    console.error(err.stack);
    if(err instanceof jwt.TokenExpiredError)
      return {status:401,message:"Token expired! Please login again!"};
    return {status:401,message:"Invalid token! Please login!"};
  }
  let user;
  try{
    user = await User.findById(verify.id);
  } catch (err) {
    console.error('getUserLogged',err.stack);
    return {status:500,message:"Something's gone wrong!"};
  }
  if(!user){
    return {status:400,message:"User not found!"};
  }
  return {status:200,user:user};
}

module.exports = {getUserLogged};