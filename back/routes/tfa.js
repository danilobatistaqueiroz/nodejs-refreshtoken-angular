const express = require("express");
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");
const router = express.Router();
const TFA = require("../models/tfa");
const { getUserLogged } = require("../common/user.logged");

router.get("/tfa/generate", (req, res) => {
  return generateTfa(req,res);
});

router.get("/tfa", async (req, res) => {
  let tfa = await getTfa(req.query.email);
  if (tfa) {
    return res.json({tfa:tfa});
  }
  return res.json({});
});

router.post("/tfa/verify", (req, res) => {
  return verifyTfa(req,res);
});

router.post("/tfa/enable", (req, res) => {
  return enableLoginUsingTfa(req,res,true);
});

router.post("/tfa/disable", (req, res) => {
  return enableLoginUsingTfa(req,res,false);
});

async function enableLoginUsingTfa(req,res,enabled){
  let user = await getUserLogged(req);
  if(!user){
    return res.status(400).json({message:"User not found!"});
  }
  user.tfa={enabled:enabled};
  user.save();
  return res.status(200).json({message:"Two factor authentication enabled with success!"});
}

async function generateTfa(req,res){
  let email = req.query.email;
  console.log("generateTfa",email);
  const secret = speakeasy.generateSecret({
    length: 10,
    name: email,
    issuer: "Labs Corp"
  });
  var url = speakeasy.otpauthURL({
      secret: secret.base32,
      label: email,
      issuer: "Labs Corp",
      encoding: "base32"
  });
  let tfa = await getTfa(email);
  if(!tfa){
    return res.status(400).json({message:"Two phase authentication isn't working on this user!"});
  }
  QRCode.toDataURL(url, (err, dataURL) => {
      tfa.secret = "";
      tfa.tempSecret = secret.base32;
      tfa.dataURL = dataURL;
      tfa.tfaURL = url;
      tfa.save();
      return res.json({
          message: "TFA Auth needs to be verified",
          tempSecret: secret.base32,
          dataURL,
          tfaURL: secret.otpauth_url
      });
  });
}

function loginUsingTFA(user,token,req,res) {
  if (!req.headers["x-tfa"]) {
    return res.status(206).json({message: "Please enter the Auth Code"});
  }
  let isVerified = speakeasy.totp.verify({
    secret: user.tfa.secret,
    encoding: "base32",
    token: req.headers["x-tfa"]
  });
  if (isVerified) {
    return res.cookie("token",token,{httpOnly:true, secure:true}).json({success:true,message:"LoggedIn Successfully",tfa:true});
  } else {
    return res.status(206).json({message: "Invalid Auth Code"});
  }
}

async function verifyTfa(req,res){
  let user = await getUserLogged(req);
  console.log("user",user);
  if(!user){
    return res.status(400).json({message:"User doesn't exists!"});
  }
  let tfa = await getTfa(user.email);
  console.log("tfa",tfa);
  if(!tfa){
    return res.status(400).json({message:"Two phase authentication isn't working on this user!"});
  }
  console.log("verifyTfa",tfa.tempSecret,req.body.token);
  let isVerified = speakeasy.totp.verify({
    secret: tfa.tempSecret, //secret usado em setupTfa, criado com generateSecret, ao ativar o Two Factor, secret baseado no email e issuer Danilo
    encoding: "base32",
    token: req.body.token //token fornecido pelo usuario usando o Google Authenticator
  });
  if (isVerified) {
      tfa.secret = tfa.tempSecret;
      tfa.save();
      return res.json({message: "Two-factor Auth is enabled successfully"});
  }
  return res.status(403).json({message: "Invalid Auth Code, verification failed. Please verify the system Date and Time"});
}


async function getTfa(email) {
  let tfa;
  try{
    tfa = await TFA.findOne({email:email});
    if(!tfa){
      tfa = new TFA({email:email});
    }
    return tfa;
  } catch (ex) {
    console.error(ex);
    return null;
  }
}

module.exports = router;