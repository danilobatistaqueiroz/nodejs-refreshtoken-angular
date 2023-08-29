const speakeasy = require("speakeasy");
const QRCode = require("qrcode");
const TFA = require("../models/tfa");
const User = require("../models/user");
const { getUserLogged } = require("../common/user.logged");

async function enableLoginUsingTfa(req,enabled){
  let user = await getUserLogged(req);
  if(!user){
    return {status:404,message:"User not found!"};
  }
  user.tfa={enabled:enabled};
  user.save();
  return {status:200,message:"Two factor authentication enabled with success!"};
}

async function generateTfa(req){
  let email = req.body.email;
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
    return {status:400,body:{message:"Two phase authentication isn't working on this user!"}};
  }
  const dataURL = await QRCode.toDataURL(secret.otpauth_url);
  tfa.secret = "";
  tfa.tempSecret = secret.base32;
  tfa.dataURL = dataURL;
  tfa.tfaURL = url;
  tfa.save();
  return {
      status:200,
      body:{
        message: "TFA Auth needs to be verified",
        tempSecret: secret.base32,
        dataURL,
        tfaURL: secret.otpauth_url
      }
  };

}

async function verifyTfa(email,authcode){
  if(!authcode) {
    return {status:400,message:"You need to inform the auth code!"}
  }
  let user = await User.findOne({email:email});
  if(!user){
    return {status:404,message:"User doesn't exists!"};
  }
  let tfa = await getTfa(email);
  if(!tfa){
    return {status:400,message:"Two phase authentication isn't configured on this user!"};
  }
  let isVerified = speakeasy.totp.verify({
    secret: tfa.tempSecret, //secret criado com generateSecret, ao ativar o Two Factor, secret baseado no email e issuer Danilo
    encoding: "base32",
    token: authcode //token fornecido pelo usuario usando o Google Authenticator
  });
  if (isVerified) {
    tfa.secret = tfa.tempSecret;
    tfa.save();
    return {status:200,message:"Two-Factor-Auth is enabled successfully"};
  }
  return {status:403,message:"Invalid auth code, verification failed. Please verify the system Date and Time"};
}


async function getTfa(email) {
  let tfa;
  try{
    tfa = await TFA.findOne({email:email});
    if(!tfa){
      tfa = new TFA({email:email});
    }
    return tfa;
  } catch (err) {
    console.error(err.stack);
    return null;
  }
}

module.exports = {generateTfa,getTfa,verifyTfa,enableLoginUsingTfa};