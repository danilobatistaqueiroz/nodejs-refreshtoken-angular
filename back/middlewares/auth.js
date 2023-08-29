const User = require("../models/user");
const Admin = require("../models/admin");
const jwt = require("jsonwebtoken");

const checkAuthenticated = async (req) => {
  const { token } = req.cookies;
  if(!token){
    return {success:false,message:"Please login to have access!",status:401};
  }
  let verify = null;
  try{
    verify = await jwt.verify(token, process.env.SECRET_KEY);
  } catch (err) {
    console.error(err.stack);
    if(err instanceof jwt.TokenExpiredError) {
      return {success:false,message:"Token Expired! Please login again!",status:401};
    }
    return {success:false,message:"Unauthorized!",status:401};
  }
  let user;
  try{
    user = await User.findById(verify.id);
    if(!user.confirmed){
      return {success:false,message:"You need to confirm the email!",status:403};
    }
    if(!user.enabled){
      return {success:false,message:"User isn't enabled!",status:403};
    }
  } catch (err) {
    console.error(err.stack);
    return {success:false,message:"Something's gone wrong!",status:500};
  }
  if (!user) {
    return {success:false,message:"User not found!",status:404};
  }
  return {success:true,message:'',user:user,status:200};
}

const isUserAuthenticated = async (req, res, next) => {
  try {
    const result = await checkAuthenticated(req);
    if(!result.success){
      return res.status(result.status).send(result.message);
    }
    req.user=result.user;
    return next();
  } catch (err) {
    console.error(err.stack);
    return res.status(500).send("Something's gone wrong!");
  }
}

const isAdminAuthenticated = async (req, res, next) => {
  try {
    const result = await checkAuthenticated(req);
    if(!result.success){
      return res.status(result.status).send(result.message);
    }
    req.user=result.user;
    let admin = await Admin.findOne({email:result.user.email});
    if (!admin) {
      return res.status(401).send("Unauthorized!");
    }
    next();
  } catch (err) {
    console.error(err.stack);
    return res.status(500).send("Something's gone wrong!");
  }
}

module.exports = {isUserAuthenticated, isAdminAuthenticated};