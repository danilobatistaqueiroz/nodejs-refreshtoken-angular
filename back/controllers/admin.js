const Admin = require("../models/admin");

async function getAdmins(email){
  try {
    let admin;
    if(email)
      admin = await Admin.find({email:email});
    else
      admin = await Admin.find({});
    if (!admin) {
      return { status:204, message: "No user found" };
    }
    return { status:200, admin: admin };
  } catch (err) {
    console.error(err.stack);
    return { status:500, message: "Something's gone wrong!" };
  }
}

async function saveAdmin(req){
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
    return {status:200,message:"Admin updated with success!"};
  } catch (err) {
    console.error(err.stack);
    return {status:400,message:"Something's gone wrong!"};
  }
};

module.exports = {saveAdmin, getAdmins};