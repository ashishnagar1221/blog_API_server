const express = require('express')
const router = express.Router();
const moongose = require('mongoose')
const bcrypt = require('bcryptjs')
const Posts = require('../models/Post');
const Users = require('../models/User');


router.post('/adduser',(req,res) =>{
    const newUser = new Users();
    const {name,email,password} = req.body;
    newUser.name = name;
    newUser.email = email;
    
    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(password,salt,(err,hash)=>{
            if(err) return res.send(err);
            newUser.password = hash; 
            newUser.save((err,add)=>{
                if(err)
                    return res.send(`Error while adding the new User: ${err}`);
                return res.json(add);
            })
        })
    }) 
})

module.exports = router;