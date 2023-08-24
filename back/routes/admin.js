const express = require("express");
const router = express.Router();
const Admin = require("../models/admin");
const {isAdminAuthenticated} = require("../middlewares/auth");

async function getAdmins(email){
  try {
    let admin;
    if(email)
      admin = await Admin.find({email:email});
    else
      admin = await Admin.find({});
    if (!admin) {
      return res.status(204).json({ message: "No user found" })
    }
    return res.json({ admin: admin })
  } catch (err) {
    return res.status(500).json({ error: err });
  }
}
router.get("/admin", isAdminAuthenticated, async (req, res) => {
  return await getAdmins();
});

router.get("/dashboard", isAdminAuthenticated, async (req, res) => {
  //TODO: gerar a rota no angular para home com base em algo daqui
  return res.json({})
});

router.post("/admin", isAdminAuthenticated, async (req, res) => {
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
    return res.json({message:"Admin updated with success!"});
  } catch (err) {
    console.error(err.message);
    res.status(400).json({message:"Something got wrong!"});
  }
});

module.exports = router;