const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Confirmation = require("../models/confirmation");
const {isUserAuthenticated} = require("../middlewares/auth");
const { getUserLogged } = require("../common/user.logged");

router.get("/user", isUserAuthenticated, async (req, res) => {
  try {
    let user = await getUserLogged(req);
    if(!user){
      return res.status(400).json({message:"User not found!"});
    }
    return res.json({ user: user })
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});

router.get("/user/tfa", async (req,res)=>{
  let email = req.query.email;
  let user = await User.findOne({email:email});
  if(!user){
    return res.status(400).json({message:"Something got wrong!"});
  }
  return res.json({tfa:user.tfa.enabled});
});

router.get("/user/confirm", async (req, res) => {
  try {
    const confirm = await Confirmation.findOne({code:req.query.code});
    if(!confirm){
      return res.status(403).json({message: "The confirmation code doesn't match!"});
    }
    const user = await User.findOne({email:confirm.email});
    if (!user) {
      return res.status(204).json({ message: "No user found!" });
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
    return res.json({ message: "Registration finished!" })
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err });
  }
});

router.get("/home", isUserAuthenticated, async (req, res) => {
  //TODO: gerar a rota no angular para home com base em algo daqui
  res.json({});
});

router.get("/info", isUserAuthenticated, async (req, res) => {
  //TODO: gerar informações
  const users = await User.find({});
  return res.json(users);
});

module.exports = router;