const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const Posts = require('./models/Post');
const Users = require('./models/User');



const app = express();

const URI = "'mongodb://127.0.0.1:27017/Blog"

mongoose.connect(URI,  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify:false,
    useCreateIndex: true
})
  .then(()=> console.log('Conected to Database...'))
  .catch(err =>console.log(err));

  app.use(bodyParser.json());

  app.get('/',(req,res)=>{
      res.send("Happy to connect!")
  })
  
//Show all users in database
app.get('/users',(req,res)=>{
    Users.find().exec((err,users) =>{
        if(err)
          return res.send(err);
        return res.json(users)
    })
})

//read the existing data = fetches the blog posts

app.get('/posts',(req,res)=>{
    Posts.find().exec((err,posts) =>{
        if(err)
          return res.send(err);
        return res.json(posts)
    })
})


//ading a new user in database
app.post('/users',(req,res) =>{
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


//to check the valid user = pass user_name and password as a query parameter and check if the user exists
app.get('/post/valid',(req,res)=>{
    Users.find({name:req.query.name,email:req.query.email}).exec((err,docs) =>{
        if(err)
            return res.send(err)
        else if(docs.length)
          return res.send("User is valid");  
        else return res.send("Invalid User");
    })
})



const PORT = process.env.PORT || 3600;

app.listen(PORT, function(){
    console.log(`Server started on port ${PORT}`);
})