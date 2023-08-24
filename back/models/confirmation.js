const mongoose = require("mongoose");

let schema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        minLength:[5,"Email should be minimum of 5 characters"]
    },
    code:{
        type:String,
        required:true
    }
  });

const Confirmation = mongoose.model("confirmation",schema);
module.exports = Confirmation;