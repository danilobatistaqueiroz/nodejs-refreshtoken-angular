const User = require("../models/user");
const jwt = require("jsonwebtoken");

async function getUserLogged(req) {
  const { token } = req.cookies;
  if(!token){
    return null;
  }
  let verify = null;
  try{
    verify = await jwt.verify(token, process.env.SECRET_KEY);
  } catch (err) {
    console.error(err);
    if(err instanceof jwt.TokenExpiredError)
      return null;
    return null;
  }
  let user;
  try{
    user = await User.findById(verify.id);
  } catch (err) {
    console.error(err);
    return null;
  }
  return user;
}

module.exports = {getUserLogged};