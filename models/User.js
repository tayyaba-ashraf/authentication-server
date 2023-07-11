const mongoose  = require('mongoose');
const bcrypt = require('bcrypt')

// we are creating schema/model
// // schema is basically a blueprint for telling to mongoo that which type of data we are goin to store 
// in database
const userSchema = new mongoose.Schema({
    // schema variables are  objects
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
         
    }

})

//hashing and salting a password
userSchema.pre('save' , function(next){
    const user = this;
    if(!user.isModified('password')){
        return next()
    }
    bcrypt.genSalt(10,(err,salt) => {
        if(err){
            return next(err)
        }
        bcrypt.hash(user.password,salt,(err,hash) => {
            if(err){
                return next(err)
            }
            user.password = hash;
            next();
        })

    })


})

userSchema.methods.comparePassword = function(candidatePassword){
    const user = this;
    return  new Promise((resolve , reject) => {
        bcrypt.compare(candidatePassword,user.password,(err , isMatch) => {
            if(err){
                return reject(err)
            }
           if(!isMatch){
                return reject(err)
           }
           resolve(true)
        })
    })
}

mongoose.model('User',userSchema);
