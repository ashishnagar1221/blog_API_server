const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const Posts = require('./models/Post');
const Users = require('./models/User');



const app = express();

const URI = "mongodb://127.0.0.1:27017/Blog"
//const URI = "mongodb+srv://user:root@taramandal-puhil.mongodb.net/Blog?retryWrites=true&w=majority"

mongoose.connect(URI,  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify:false,
    useCreateIndex: true
})
  .then(()=> console.log('Conected to Database...'))
  .catch(err =>console.log(err));

  app.use(bodyParser.json());
  app.use(require('./routes/auth'))
  
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
// app.post('/adduser',(req,res) =>{
//     const newUser = new Users();
//     const newPost = new Posts();
//     const {name,email,password,allPost} = req.body;
//     newUser.name = name;
//     newUser.email = email;
//     //newUser.allPost = allPost;
//     bcrypt.genSalt(10,(err,salt)=>{
//         bcrypt.hash(password,salt,(err,hash)=>{
//             if(err) return res.send(err);
//             newUser.password = hash; 
//             newUser.save((err,add)=>{
//                 if(err)
//                     return res.send(`Error while adding the new User: ${err}`);
//                 return res.json(add);
//             })
//         })
//     }) 
// })

//to check the valid user = pass user_name and password as a query parameter and check if the user exists
app.get('/post/valid',(req,res)=>{
    const UserName = req.query.name;
    const pass = req.query.password;
    Users.findOne({name:UserName})
    .then((user)=>{
        //console.log(user)
        if(!user){
            return res.status(404).json({name:'User not found'})
        }
        bcrypt.compare(pass,user.password).then(isMatch=>{
            if(isMatch)
            return res.send("User is valid");  
            else return res.send("Invalid User");
            
        })
    })
})

//Adding a new post in data base
app.post('/newpost',(req,res)=>{
    Users.findOne({name:req.body.postedBy})
    .then((user)=>{
        console.log(user._id)
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
    // console.log(delTitle)
    Posts.findOne({title:delTitle})
    .then((post) =>{
        Users.findOne({allPost:post._id}).then((user)=>{    
        //console.log(user.allPost)
            if(user.allPost.includes(post._id)){
                //console.log(post._id)
                Posts.deleteOne({title:post.title},(err,del)=> {
                    if(err) console.log(err);
                    else{
                        return res.json(del);
                    }
                });
            }
        })
    })
})


const PORT = process.env.PORT || 3600;

app.listen(PORT, function(){
    console.log(`Server started on port ${PORT}`);
})