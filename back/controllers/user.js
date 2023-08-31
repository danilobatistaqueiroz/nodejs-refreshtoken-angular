const User = require("../models/user");
const Confirmation = require("../models/confirmation");
const { getUserLogged } = require("../common/user.logged");
const logger = require("../common/logger");

async function getUser(req,res){
  try {
    let result = await getUserLogged(req);
    if(result.status==200){
      return res.status(result.status).json({user:result.user});
    }
    return res.status(result.status).json({message:result.message});
  } catch (err) {
    logger.error('getUser',err.stack);
    return res.status(500).json({message:"Something's gone wrong!"});
  }
}

async function getUserTfa(req,res){
  const email = req.query?.email;
  if(!email){
    return res.status(400).json({message:"You need to supply an email!"});
  }
  const user = await User.findOne({email:email});
  if(!user){
    return res.status(404).json({message:"User doesn't exists!"});
  }
  return res.status(200).json({tfa:user.tfa.enabled});
}

async function confirmUser(req,res){
  try {
    const confirm = await Confirmation.findOne({code:req.query?.code});
    if(!confirm){
      return res.status(403).json({message:"The confirmation code doesn't match!"});
    }
    const user = await User.findOne({email:confirm.email});
    if (!user) {
      return res.status(404).json({message:"No user found!"});
    }
    /******* ha duas opcoes, ou usar o objeto user.save(), ou User.updateOne() */
    user.enabled=true;
    user.confirmed=true;
    let result = await user.save();
    /*let result = await User.updateOne(
      {_id:user.id},
      { $set: {
          confirmed:true,
          enabled:true
        }
      }
    );*/
    return res.status(200).json({message:"Registration finished!"});
  } catch (err) {
    logger.error('confirmUser',err.stack);
    return res.status(500).json({message:"Something's gone wrong!"});
  }
}

async function getInfo(){
  const users = await User.find({});
  return users;
}

module.exports = {getUser,getUserTfa,confirmUser,getInfo};