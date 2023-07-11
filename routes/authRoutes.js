 const express=require('express');
const mongoose=require('mongoose')
const jwt = require('jsonwebtoken')
const {jwtkey} = require('../keys')




const router=express.Router();

// // importing model/schema
const User = mongoose.model('User')


// creating a signup route on which post request will come from client
router.post('/signup', async(req,res)=>{
   

    // fetching data from request and saving into user present in database
    const {email , password } = req.body;
    try{

      const user=new User({email,password});
      await user.save();

      // after saving user token will create and will given to user
      const token = jwt.sign({userId:user._id} , jwtkey )
      res.send({token})
    
    }
    catch(err){
      return res.status(422).send(err.message)

    }

   
})

// creating a signin route on which post request will come from client
router.post('/signin',async(req , res) => {
  const {email,password} = req.body;
  if(!email || !password){
    return res.status(422).send({error : "must provide email or password"})
  }
  const user = await User.findOne({email});
  if(!user){
    return res.status(422).send({error : "must provide email or password"})

  }
  try{
    await user.comparePassword(password);
    // every time unique token will generate  
    const token = jwt.sign({userId:user._id} , jwtkey )
    res.send({token}) 
  }
  catch(err){
    return res.status(422).send({error : "must provide email or password"})

  }
})



// exporting router
module.exports = router;