const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Confirmation = require("../models/confirmation");
const mailer = require("../common/email");
const logger = require("../common/logger");

async function register(req,res){
  const { email, password, name, tfa } = req.body;
  if ((!email || !password) || (email.trim() == "" || password.trim() == "")) {
    return res.status(400).json({message:"Email and password is required!"});
  }
  const userExist = await User.findOne({ email: email });
  if (userExist) {
    return res.status(400).json({message:"User already exist with the given email!"});
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
    return res.status(200).cookie({"token":token}).json({message:"User registered successfully"});
  } catch (err) {
    logger.error(`register ${email} ${name} ${tfa}`);
    logger.error(err.stack);
    if(err.errors && err.errors.email)
      logger.error(err.errors.email.properties.message);
    if(err.errors && err.errors.password)
      logger.error(err.errors.password.properties.message);
    return res.status(500).json({message:"Something's gone wrong!"});
  }
}

async function storeConfirmation(email,code){
  const confirm = await Confirmation.replaceOne({email:email},{code:code,email:email},{upsert:true});
  if(!confirm){
    throw new Error("Something's gone wrong in the confirmation!");
  }
}

module.exports = {register};