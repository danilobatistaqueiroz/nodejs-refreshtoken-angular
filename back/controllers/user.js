const User = require("../models/user");
const Confirmation = require("../models/confirmation");
const { getUserLogged } = require("../common/user.logged");

async function getUser(req){
  try {
    let user = await getUserLogged(req);
    if(!user){
      return {status:400,body:{message:"User not found!"}};
    }
    return {status:200,body:{user:user}};
  } catch (err) {
    console.error(err.stack);
    return {status:500,body:{message:"Something's gone wrong!"}};
  }
}

async function getUserTfa(req){
  let email = req.query.email;
  let user = await User.findOne({email:email});
  if(!user){
    return {status:404,body:{message:"User doesn't exists!"}};
  }
  return {status:200,body:{tfa:user.tfa.enabled}};
}

async function confirmUser(req){
  try {
    const confirm = await Confirmation.findOne({code:req.query.code});
    if(!confirm){
      return {status:403,message:"The confirmation code doesn't match!"};
    }
    const user = await User.findOne({email:confirm.email});
    if (!user) {
      return {status:404,message:"No user found!"};
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
    return {status:200,message:"Registration finished!"};
  } catch (err) {
    console.error(err.stack);
    return {status:500,message:"Something's gone wrong!"};
  }
}

async function getInfo(){
  const users = await User.find({});
  return users;
}

module.exports = {getUser,getUserTfa,confirmUser,getInfo};