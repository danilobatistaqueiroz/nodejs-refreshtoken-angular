const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const Token = require("../models/token");
const User = require("../models/user");
const Confirmation = require("../models/confirmation");
const { sendPasswordResetRequest, sendPasswordReset } = require("../common/email");

const JWTSecret = process.env.JWT_SECRET;
const bcryptSalt = process.env.BCRYPT_SALT;
const clientURL = process.env.CLIENT_URL;

async function passwordResetRequest(req,res){
  console.log('passwordResetRequest');
  const email = req.body?.email;
  if(!email){
    return res.status(400).json({message:"You need to supply an email!"});
  }
  const user = await User.findOne({email:email});
  if (!user) {
    return res.status(404).json({message:"Email does not exist!"});
  }
  
  let token = await Token.findOne({ userId: user._id });
  if (token) {
    await token.deleteOne();
  }

  let resetToken = crypto.randomBytes(32).toString("hex");
  const hash = await bcrypt.hash(resetToken, Number(bcryptSalt));

  await new Token({
    userId: user._id,
    token: hash,
    createdAt: Date.now(),
  }).save();

  const link = `${clientURL}/password-reset?token=${resetToken}&userId=${user._id}`;

  await sendPasswordResetRequest(user.name,user.email,link);

  return res.status(200).json({message:"Password reset requested with success!"});
}

async function passwordReset(req,res){
  const { userId, token, password } = req.body;
  console.log('userId',userId,'token',token,'password',password);

  let serverToken = await Token.findOne({userId: userId });
  if (!serverToken) {
    return res.status(403).json({message:"Invalid or expired token"});
  }
  const isValid = await bcrypt.compare(token, serverToken.token);
  if (!isValid) {
    return res.status(403).json({message:"Invalid or expired token"});
  }
  const hash = await bcrypt.hash(password, Number(bcryptSalt));
  await User.updateOne(
    { _id: userId },
    { $set: { password: hash } },
    { new: true }
  );
  const user = await User.findById({ _id: userId });
  await sendPasswordReset(user.email);
  await serverToken.deleteOne();
  return res.status(200).json({message:"Password reset was successful"});
}

module.exports = {passwordResetRequest, passwordReset};