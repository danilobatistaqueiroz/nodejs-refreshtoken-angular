const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const Tfa = require("./tfa");

async function login(req) {
  const { email, password } = req.body;
  const authcode = req.get("x-tfa");
  const user = await User.findOne({email:email});
  if (checkEmailPassword(user, password)==false) {
    return {status:403,message:"Invalid email or password"};
  }
  if(!user.confirmed){
    return {status:403,message:"User isn't confirmed!"};
  }
  if(!user.enabled){
    return {status:403,message:"User isn't enabled!"};
  }
  if(user.tfa?.enabled){
    const tfaValidation = await Tfa.verifyTfa(email, authcode);
    if(tfaValidation.status!=200){
      return tfaValidation;
    }
  }
  const token = await jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
  return {token:token,status:200,message:"LoggedIn Successfully"};
}

function checkEmailPassword(user, password) {
  if(!user){
    return false;
  }
  const result = bcrypt.compareSync(password,user.password);
  return result;
}

module.exports = {login};