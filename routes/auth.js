const express = require('express')
const router = express.Router();
const moongose = require('mongoose')
const bcrypt = require('bcryptjs')
const Posts = require('../models/Post');
const Users = require('../models/User');


router.post('/adduser',(req,res) =>{
    //const newUser = new Users();
    const {name,email,password} = req.body;
    if(!name|| !password || !email ){
        return res.status(422).json({error:"please add all the fields"})
     }
    Users.findOne({email:email})
    .then((saveUser)=>{
        if(saveUser){
            return res.status(422).json({error:"please add all the fields"})
        }
    })
    bcrypt.hash(password,12)
    .then(hashpwd =>{
        const user = new Users({
            name,
            email,
            password:hashpwd
        })

        user.save()
        .then(user=>{
            res.json({messege:"saved successfully"})
        })
        .catch(err=>{
            console.log(err)
        })
    })
})

router.post('/signin',(req,res)=>{
    const {email,password} = req.body
    if(!email || !password){
        return res.status(422).json({error:"please enter email and password"})
    }

    Users.findOne({email:email})
    .then((addUser)=>{
        if(!addUser){
            return res.status(422).json({error:"Invalid Email id or password"})
        }
        bcrypt.compare(password,addUser.password)
        .then((match)=>{
            if(match){
                //const token = jwt.sign({_id:addUser._id},JWT)
                const {_id,name,email} = addUser
                // res.json({token,user:{_id,name,email}})
                res.json({message:"Sucessfully Signed in"})
            }
                //res.json({message:"Sucessfully Signed in"})
            else
                return res.status(422).json({error:"Invalid Email id or password"})
        })
        
    })
})

module.exports = router;