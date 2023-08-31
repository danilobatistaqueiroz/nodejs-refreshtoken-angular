const mongoose = require("mongoose");
const { v4: uuidv4 } = require('uuid');

const schema = new mongoose.Schema({
  token: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  expiryDate: Date,
});

schema.statics.createToken = async function (user) {
  let expiredAt = new Date();

  expiredAt.setSeconds(
    expiredAt.getSeconds() + parseInt(process.env.JWT_REFRESH_EXPIRE)
  );

  let _token = uuidv4();

  let _object = new this({
    token: _token,
    user: user._id,
    expiryDate: expiredAt.getTime(),
  });

  let refreshToken = await _object.save();

  return refreshToken.token;
};

schema.statics.verifyExpiration = (token) => {
  return token.expiryDate.getTime() < new Date().getTime();
}

const RefreshToken = mongoose.model("refreshtoken", schema);

module.exports = RefreshToken;