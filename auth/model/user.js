const mongoose = require("mongoose");

const UserSchema=new mongoose.Schema({
    
    token:{type:String},
    name: {type:String,required:true},
    password: { type: String, required: true },
    mobileNumber:{type:Number,required: true },
    email:{type:String,required: true },
    gender:{type:String,required: true },
    address:{
      line:{type:String},
       state:{type:String},
       pin:{type:Number}
            },
    signUpDate:{type:String},     
  });
  //user

  const User=mongoose.model('user_data',UserSchema)
  module.exports = {User}