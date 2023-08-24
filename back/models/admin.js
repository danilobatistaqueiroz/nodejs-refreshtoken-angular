const mongoose = require("mongoose");
Promise = require("bluebird");
mongoose.Promise = Promise;

let schema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        minLength:[5,"Email should be minimum of 5 characters"]
    },
    enabled:{
        type:Boolean,
        required:true
    }
  });

const Admin = mongoose.model("admin",schema);
module.exports = Admin;