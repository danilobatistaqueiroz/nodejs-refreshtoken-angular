const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        minLength:[5,"Email should be minimum of 5 characters"]
    },
    secret: {
      type:String
    },
    tempSecret: {
      type:String
    },
    dataURL: {
      type:String
    },
    tfaURL: {
      type:String
    }
})

const TFA = mongoose.model("tfa",schema);
module.exports = TFA;