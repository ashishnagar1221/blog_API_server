const jwt = require('jsonwebtoken')
const {JWT} = require("./keys")
const mongoose = require('mongoose')
const User = mongoose.model('User')
module.exports = (req,res,next)=>{
    const {authorization} = req.headers
    if(!authorization){
        return res.status(401).json({error:"Loggin to access content"})
    }
    const token = authorization.replace("Bearer ","")
    jwt.verify(token,JWT,(err,data)=>{
        if(err){
            return res.status(401).json({error:"Loggin to access content"})    
        }
        const {_id} = data
        User.findById(_id).then((userdata)=>{
            req.user = userdata
            next()
        })  
    })
}