const logger = require("../common/logger");
const RefreshToken = require("../models/refresh-token");
const jwt = require("jsonwebtoken");

const refreshToken = async (req, res) => {
  const { 'refresh-token': requestToken } = req.cookies;

  if (requestToken == null) {
    return res.status(403).json({message:"Refresh Token is required! Please login again!"});
  }

  try {
    let refreshToken = await RefreshToken.findOne({token:requestToken});
    if (!refreshToken) {
      return res.status(403).json({message:"Refresh token is not in database! Please login again!"});
    }

    if (RefreshToken.verifyExpiration(refreshToken)) {
      RefreshToken.findByIdAndRemove(refreshToken._id, {useFindAndModify:false}).exec();
      return res.status(403).json({message:"Refresh token was expired. Please make a new signin request"});
    }

    let token = jwt.sign({id:refreshToken.user._id}, process.env.SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRE
    });

    res.status(200);
    res.cookie("token",token, {httpOnly:true, secure:true});
    res.cookie("refresh-token",refreshToken.token, {httpOnly:true,secure:true,path:"/auth/refresh-token"});
    res.json({message:""});
  } catch (err) {
    logger.error('refreshToken',err.stack);
    return res.status(500).send({message:"Something's gone wrong!"});
  }
};

module.exports = {refreshToken};