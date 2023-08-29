const mongoose = require("mongoose");
mongoose.Promise = Promise

const bcrypt = require("bcryptjs");
const bcryptSalt = process.env.BCRYPT_SALT;

const schema = new mongoose.Schema(
  {
    email:{
        type:String,
        required:true,
        unique:true,
        trim: true,
        minLength:[5,"Email should be minimum of 5 characters"]
    },
    password:{
        type:String,
        required:true,
        minLength:[8,"Password should be minimum of 8 characters"]
    },
    name:{
      type:String,
      required:true,
      trim: true
    },
    tfa:{
        enabled: {
          type:Boolean,
          required:true
        }
    },
    enabled:{
      type:Boolean
    },
    confirmed:{
      type:Boolean
    }
  },
  {
    timestamps: true,
  }
);

schema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const hash = await bcrypt.hash(this.password, Number(bcryptSalt));
  this.password = hash;
  next();
});

const User = mongoose.model("user",schema);
module.exports = User;