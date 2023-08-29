const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Confirmation = require("../models/confirmation");
const mailer = require("../common/email");

async function register(req){
  const { email, password, name, tfa } = req.body;
  if ((!email || !password) || (email.trim() == "" || password.trim() == "")) {
    return {status:400,body:{message:"Email/ password is required"}};
  }
  const userExist = await User.findOne({ email: email });
  if (userExist) {
    return {status:400,body:{message:"User already exist with the given email"}};
  }
  const newUser = new User({email:email,password:password,name:name,tfa:{enabled:tfa}});
  try{
    await newUser.save();
    const token = await jwt.sign({ id: newUser._id }, process.env.SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRE,
    });
    const code = Math.floor(10000 + Math.random() * 90000);
    mailer.sendConfirmation(newUser.name,email,code);
    await storeConfirmation(email,code);
    return {token:token,status:200,body:{message:"User registered successfully"}};
  } catch (err) {
    console.error(`register error ${email} ${name} ${tfa}`);
    console.error(err.stack);
    if(err.errors && err.errors.email)
      console.error(err.errors.email.properties.message);
    if(err.errors && err.errors.password)
      console.error(err.errors.password.properties.message);
    return {status:500,body:{message:"Something's gone wrong!"}};
  }
}

async function storeConfirmation(email,code){
  try {
    const confirm = await Confirmation.replaceOne({email:email},{code:code,email:email},{upsert:true});
    if(!confirm){
      console.error("Something's gone wrong in the confirmation!");
      return false;
    }
    return true;
  } catch (err) {
    console.error(err.stack);
    return false;
  }
}

module.exports = {register};