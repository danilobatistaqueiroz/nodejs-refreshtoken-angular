const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Confirmation = require("../models/confirmation");
const mailer = require("../common/email");

router.post("/register", async (req, res) => {
  const { email, password, tfa } = req.body;
  if ((!email || !password) || (email.trim() == "" || password.trim() == "")) {
    return res.status(400).json({message: "Email/ password is required"});
  }
  const userExist = await User.findOne({ email: email });
  console.log("userExist",userExist);
  if (userExist) {
    return res.status(400).json({ message: "User already exist with the given email" })
  }
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);
  req.body.password = hashPassword;
  const user = new User({email:email,password:hashPassword,tfa:{enabled:tfa}});
  try{
    await user.save();
    const token = await jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRE,
    });
    let code = Math.floor(10000 + Math.random() * 90000);
    mailer.send(email,code);
    await confirmation(email,code);
    return res.cookie({ "token": token }).json({ success: true, message: "User registered successfully", data: user })
  } catch (err) {
    console.error(err.message);
    if(err.errors && err.errors.email)
      console.error(err.errors.email.properties.message);
    if(err.errors && err.errors.password)
      console.error(err.errors.password.properties.message);
    return res.status(500).json({ success: false, message: "Something got wrong!"})
  }
});

async function confirmation(email,code){
  try {
    const confirm = await Confirmation.replaceOne({email:email},{code:code,email:email},{upsert:true});
    if(!confirm){
      console.error("Something got wrong in the confirmation!");
      return false;
    }
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

module.exports = router;