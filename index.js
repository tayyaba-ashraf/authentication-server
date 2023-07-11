const express = require('express')
const bodyParser=require('body-parser')
const mongoose=require('mongoose')

const app=express()
const PORT=3000
const {mongoUrl} = require('./keys')







//requiring model 
require('./models/User')

// importing requireToken
const requireToken = require('./middleware/requireToken')

// importing authRoutes
const authRoutes = require('./routes/authRoutes')


// for parsing of json request that will come from frontend
app.use(bodyParser.json())
app.use(authRoutes)





// building coonection with database
mongoose.connect(mongoUrl,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
mongoose.connection.on('connected',()=>{
    console.log("connected to mongooDB")
})
mongoose.connection.on('error',(err)=>{
    console.log('This is error',err)
})



// // creating default protected route
app.get('/',requireToken,(req,res) => {
    res.send({email:req.user.email})

})



// creating port where server will listen our app  
app.listen(PORT,()=>{
    console.log("Server running"+PORT)
})

