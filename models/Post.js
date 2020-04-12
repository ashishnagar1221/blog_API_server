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
})

const Post = mongoose.model('Post',UserSchema);

module.exports = Post;