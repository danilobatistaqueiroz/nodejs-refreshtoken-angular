const speakeasy = require("speakeasy");
const QRCode = require("qrcode");
const TFA = require("../models/tfa");
const { getUserLogged } = require("../common/user.logged");

async function enableLoginUsingTfa(req,res){
  enableUserTfa(req,res,true);
}
async function disableLoginUsingTfa(req,res){
  enableUserTfa(req,res,false);
}

async function enableUserTfa(req,res,enabled){
  let result = await getUserLogged(req);
  if(result.status!=200){
    return res.status(result.status).json({message:result.message});
  }
  result.user.tfa={enabled:enabled};
  result.user.save();
  return res.status(200).json({message:"Two factor authentication enabled with success!"});
}

async function generateTfa(req,res){
  let email = req.body?.email;
  if(!email){
    return res.status(400).json({message:"You need to supply an email!"});
  }
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
  let tfa = await TFA.findOne({email:email});
  if(!tfa){
    tfa = new TFA({email:email});
  }
  const dataURL = await QRCode.toDataURL(secret.otpauth_url);
  tfa.secret = "";
  tfa.tempSecret = secret.base32;
  tfa.dataURL = dataURL;
  tfa.tfaURL = url;
  tfa.save();
  return res.status(200).json({
        message: "TFA Auth needs to be verified!",
        tempSecret: secret.base32,
        dataURL,
        tfaURL: secret.otpauth_url
      });
}

async function verifyTfa(email,authcode){
  let tfa = await TFA.findOne({email:email});
  if(!tfa){
    tfa = new TFA({email:email});
  }
  let isVerified = speakeasy.totp.verify({
    secret: tfa.tempSecret, //secret criado com generateSecret, ao ativar o Two Factor, secret baseado no email e issuer Danilo
    encoding: "base32",
    token: authcode //token fornecido pelo usuario usando o Google Authenticator
  });
  if (isVerified) {
    tfa.secret = tfa.tempSecret;
    tfa.save();
    return {success:true};
  } else {
    return {success:false,message:"Invalid auth code, verification failed. Please verify the system Date and Time"};
  }
}

async function getTfa(req,res){
  const email = req.query?.email;
  if(!email){
    return res.status(400).json({message:"You need to supply an email!"});
  }
  let tfa = await TFA.findOne({email:email});
  if(!tfa){
    tfa = new TFA({email:email});
  }
  return res.status(200).json({tfa:tfa});
}


module.exports = {generateTfa,verifyTfa,getTfa,enableLoginUsingTfa,disableLoginUsingTfa};