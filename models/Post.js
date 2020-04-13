const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    title:{
        type: String,
        required:true
    },
    postText:{
        type: String,
        required:true
    },
    postedBy:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    }
})

const Post = mongoose.model('Post',UserSchema);

module.exports = Post;