const Admin = require("../models/admin");

async function getAdmins(req,res){
  const email = req.query?.email;
  if(!email){
    return res.status(400).json({message:"You need to supply an email!"});
  }
  try {
    let admin;
    if(email)
      admin = await Admin.find({email:email});
    else
      admin = await Admin.find({});
    if (!admin) {
      return res.status(204).json({message:"No user found!"});
    }
    return res.status(200).json({admin: admin});
  } catch (err) {
    console.error('getAdmins',err.stack);
    return res.status(500).json({message:"Something's gone wrong!"});
  }
}

async function saveAdmin(req,res){
  const {email,enabled} = req.body;
  const result = await Admin.findOne({email:email});
  try{
    if(!result){
      await Admin.save({email:email,enabled:enabled==="true"});
    } else {
      await Admin.updateOne({_id:result.id},{
        $set: {email:email,enabled:enabled==="true"}
      });
    }
    return res.status(200).json({message:"Admin updated with success!"});
  } catch (err) {
    console.error('saveAdmin',err.stack);
    return res.status(400).json({message:"Something's gone wrong!"});
  }
};

module.exports = {saveAdmin, getAdmins};