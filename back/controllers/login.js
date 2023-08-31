const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const RefreshToken = require("../models/refresh-token");
const Tfa = require("./tfa");

async function login(req,res) {
  const { email, password } = req.body;
  const authcode = req.get("x-tfa");
  const user = await User.findOne({email:email});
  if (!user) {
    return res.status(404).json({message:"User not found!"});
  }
  const passwordIsValid = bcrypt.compareSync(password,user.password);
  if (!passwordIsValid) {
    return res.status(401).json({message:"Invalid password!"});
  }
  if(!user.confirmed){
    return res.status(403).json({message:"User isn't confirmed!"});
  }
  if(!user.enabled){
    return res.status(403).json({message:"User isn't enabled!"});
  }
  if(user.tfa?.enabled){
    if(!authcode) {
      return res.status(400).json({message:"You need to inform the auth code!"})
    }
    const tfaValidation = await Tfa.verifyTfa(email, authcode);
    if(tfaValidation.success==false){
      return res.status(401).json({message:tfaValidation.message});
    }
  }
  const token = await jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
  const refreshToken = await RefreshToken.createToken(user);
  res.status(200);
  res.cookie("token",token, {httpOnly:true, secure:true});
  res.cookie("refresh-token",refreshToken, {httpOnly:true, secure:true,path:"/auth/refresh-token"});
  res.json({message:"LoggedIn Successfully!"});
}

module.exports = {login};