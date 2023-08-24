const mongoose = require("mongoose");
mongoose.Promise = Promise

const schema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        minLength:[5,"Email should be minimum of 5 characters"]
    },
    password:{
        type:String,
        required:true,
        minLength:[8,"Password should be minimum of 8 characters"]
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
})

const User = mongoose.model("user",schema);
module.exports = User;