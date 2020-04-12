const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Posts = require('./models/Post');
const Users = require('./models/User');

const app = express();

const URI = "'mongodb://127.0.0.1:27017/Blog"

mongoose.connect(URI,  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify:false
})
  .then(()=> console.log('Conected to Database...'))
  .catch(err =>console.log(err));

  app.get('/',(req,res)=>{
      res.send("Happy to connect!")
  })

//read the existing data = fetches the blog posts

  app.get('/posts',(req,res)=>{
      Posts.find().exec((err,posts) =>{
          if(err)
            return res.send(err);
          return res.json(posts)
      })
})

//to check the valid user = pass user_name and password as a query parameter and check if the user exists
app.get('/post/valid',(req,res)=>{
    Users.findOne({name:req.query.name,email:req.query.email}).exec((err,posts) =>{
        if(err)
          return res.send(err);
        res.send("User is valid");  
    })
})



const PORT = process.env.PORT || 3600;

app.listen(PORT, function(){
    console.log(`Server started on port ${PORT}`);
})