const express = require('express');
const mongoose = require('mongoose');

const app = express();

const URI = "'mongodb://127.0.0.1:27017/blog"

mongoose.connect(URI,  {
    useNewUrlParser: true,
    useUnifiedTopology: true 
})
  .then(()=> console.log('Conected to Database...'))
  .catch(err =>console.log(err));

const PORT = process.env.PORT || 3600;

app.listen(PORT, function(){
    console.log(`Server started on port ${PORT}`);
})