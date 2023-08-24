const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({email:email});
  if (await checkEmailPassword(user, password)==false) {
    return res.status(403).send({message:"Invalid email or password"});
  }
  if(!user.confirmed){
    return res.status(403).send({message:"User isn't confirmed!"});
  }
  if(!user.enabled){
    return res.status(403).send({message:"User isn't enabled!"});
  }
  const token = await jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
  return res.cookie("token",token, {httpOnly:true, secure:true}).json({success:true,message:"LoggedIn Successfully",tfa:false});
});

async function checkEmailPassword(user, password) {
  if(!user){
    return false;
  }
  let result = await bcrypt.compare(password,user.password);
  return result;
}

module.exports = router;