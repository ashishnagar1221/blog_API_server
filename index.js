const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const Posts = require('./models/Post');
const Users = require('./models/User');



const app = express();

//const URI = "mongodb://127.0.0.1:27017/Blog"
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
  
  app.get('/',(req,res)=>{
      res.json("Happy to connect!")
  })

//Show all users in database
app.get('/users',(req,res)=>{
    Users.find().exec((err,users) =>{
        if(err)
          return res.json(err);
        return res.json(users)
    })
})

//read the existing data = fetches the blog posts
app.get('/posts',(req,res)=>{
    Posts.find().exec((err,posts) =>{
        if(err)
          return res.json(err);
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
            if(err) return res.json(err);
            newUser.password = hash; 
            newUser.save((err,add)=>{
                if(err)
                    return res.json(`Email already registered`);
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
            return res.json('User not found')
        }
        bcrypt.compare(pass,user.password).then(isMatch=>{
            if(isMatch)
            return res.json("This User is a valid user");  
            else return res.json("User Entered wrong password");
            
        })
    })
})

//Adding a new post in data base
app.post('/newpost',(req,res)=>{
    console.log(req.body)
    Users.findOne({name:req.body.name})
    .then((user)=>{
        if(user){ 
            //console.log(user._id)
            const {title,postText,postedBy} = req.body;
            const newPost = new Posts();
            newPost.title = title;
            newPost.postText = postText;
            newPost.postedBy = [user._id];
             
        newPost.save((err,add)=>{
            if(err)
                return res.json(`Error while adding the new User: ${err}`);
        })       
        
        
        Users.findOneAndUpdate({_id: user._id},
        {$push:{allPost: newPost}},(err, add) =>{
            if(err) res.json(`Error while adding the new User: ${err}`);
            else{
                return res.json(`Posted Successfully`);
            }
        });

    }else{
        return res.json("User doesn't exist")
    } 

    })
})


//modify a blog post for a given User
app.get('/delete',(req,res) =>{
    const delTitle = req.query.title;
    const author = req.query.name;
    Posts.findOne({title:delTitle})
    .then(post =>{
        if(!post)
            return res.json('Post of this title not found')
        else{
            //console.log(post)
            Users.findOne({name:author})
            .then(user =>{
                if(!user)
                    return res.json('User of this name not found')
                else if(user.allPost.includes(post._id)){
                    Posts.deleteOne({title:post.title},(err,del)=> {
                        if(err) return res.json("Some error occur")
                        else{
                            return res.json("Post Deleted")
                        }
                    });
                }else{
                    return res.json("Post does not belongs to Given User")
                }
            })
        }
    })
       
    
})


const PORT = process.env.PORT || 3600;

app.listen(PORT, function(){
    console.log(`Server started on port ${PORT}`);
})