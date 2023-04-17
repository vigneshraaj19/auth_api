
const router = require("express").Router();
const {User} = require("./model/user");
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const verifyToken = require('./middleware/verifyToken');

//name,password,mobileNumber,email,gender,address in the schema format like

// address:{
//   line:{type:String},
//    state:{type:String},
//    pin:{type:Number}
//         },

//are it will show error

router.post("/signup", async(req,res) =>
{ 
  try{
    const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString();

  const phoneExist=await User.findOne({mobileNumber:req.body.phone});
  const emailExist=await User.findOne({email:req.body.email});
  if(phoneExist)
  return res.status(409).send({message:"User with given phone number already exist"})
  if(emailExist)
  return res.status(409).send({message:"User with given email already exist"})

    //hashing the password
    const hashedPassword = await bcrypt.hash(req.body.password.toString(), 10); 
    const user = new User({
      name:req.body.name,
      password:hashedPassword,
      mobileNumber:req.body.mobileNumber,
      email:req.body.email,
      signUpDate:formattedDate,
      gender:req.body.gender,
      address:req.body.address,    
  }).save();

  res.status(200).send({message:"Register successfully",status:"true"});
}
catch(err)
{
  res.status(500).send({message:err,status:"false"});
}

});

//email amd password

router.put("/signin", async(req,res) =>
{ 
  try{

//getting email from the database and compare with the given email id
const userData=await User.findOne({
   email:req.body.email
});  

//if the email id is not present send the error message
if(!userData.email)  
{
return res.status(409).send({message:"Wrong credentials!",status:false})
}    

//comparing the password with database password
const isPasswordValid = await bcrypt.compare(req.body.password, userData.password);

if(!isPasswordValid)
{
    return res.status(409).send({message:"given password not exist"})
}

let  userToken =await jwt.sign({email:userData.email},'vigneshraaj', { expiresIn: '1h' });

const updateToken=await User.updateOne({ email:req.body.email},{$set:{token:userToken}});  

res.status(200).send({message:"Login successfull",status:"true",token:userToken});

}
catch(err){
res.status(500).send({message:"Login error",status:"false"});
}
})


//If u send the token it will verity the tooken and decode the token and get the email id from that
//get details from db using theis email id and it will send as response

router.get("/getdata",verifyToken, async(req,res) =>
{ 
  const userdata=await User.findOne({email:req.user.email});
  res.status(200).send(userdata);
});


module.exports = router;
