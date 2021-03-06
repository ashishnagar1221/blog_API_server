const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors')
const Posts = require('./models/Post');
const Users = require('./models/User');


const app = express();
const URI = "mongodb+srv://user:root@taramandal-puhil.mongodb.net/Blog?retryWrites=true&w=majority"

mongoose.connect(URI,  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify:false,
    useCreateIndex: true
})
  .then(()=> console.log('Conected to Database...'))
  .catch(err =>console.log(err));

  app.use(bodyParser.json());
  app.use(cors());
  
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
app.post('/adduser',(req,res) =>{
    const newUser = new Users();
    const newPost = new Posts();
    const {name,email,password,allPost} = req.body;
    newUser.name = name;
    newUser.email = email;
    //newUser.allPost = allPost;
    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(password,salt,(err,hash)=>{
            if(err) return res.send(err);
            newUser.password = hash; 
            newUser.save((err,add)=>{
                if(err)
                    return res.send(`Email already registered`);
                return res.json(add);
            })
        })
    }) 
})

//to check the valid user = pass user_name and password as a query parameter and check if the user exists
app.get('/post/valid',(req,res)=>{
    const UserName = req.query.name;
    const pass = req.query.password;
    Users.findOne({name:UserName})
    .then((user)=>{
        //console.log(user)
        if(!user){
            return res.send('User not found')
        }
        bcrypt.compare(pass,user.password).then(isMatch=>{
            if(isMatch)
            return res.send("This User is a valid user");  
            else return res.send("User Entered wrong password");
            
        })
    })
})

//Adding a new post in data base
app.post('/newpost',(req,res)=>{
    Users.findOne({name:req.body.postedBy})
    .then((user)=>{
        //console.log(user._id)
        const {title,postText,postedBy} = req.body;
        const newPost = new Posts();
        newPost.title = title;
        newPost.postText = postText;
        newPost.postedBy = [user._id];

        newPost.save((err,add)=>{
            if(err)
                return res.send(`Error while adding the new User: ${err}`);
        })
        
        
        Users.findOneAndUpdate({_id: user._id},
        {$push:{allPost: newPost}},(err, add) =>{
            if(err) console.log(err);
            else{
                return res.json(add);
            }
        });

    })
})


//modify a blog post for a given User
app.get('/delete',(req,res) =>{
    const delTitle = req.query.title;
    const author = req.query.name;
    Posts.findOne({title:delTitle})
    .then(post =>{
        if(!post)
            return res.send('Post of this title not found')
        else{
            //console.log(post)
            Users.findOne({name:author})
            .then(user =>{
                if(!user)
                    return res.send('User of this name not found')
                else if(user.allPost.includes(post._id)){
                    Posts.deleteOne({title:post.title},(err,del)=> {
                        if(err) return res.send("Some error occur")
                        else{
                            return res.send("Post Deleted")
                        }
                    });
                }else{
                    return res.send("Post does not belongs to Given User")
                }
            })
        }
    })
       
    
})


const PORT = process.env.PORT || 3600;

app.listen(PORT, function(){
    console.log(`Server started on port ${PORT}`);
})