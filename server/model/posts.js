const mongoose = require('mongoose');
const Posts = mongoose.model('posts',{
    title:{
        type:String,
        trim:true,
    },
    context:{
        type:String,
        trim:true,
    },
    userId:{
        type:String,
        trim:true,
    },
    image:{
        type:String,
        trim:true,
    },
    dataPost:{
        type:Date
    }
})

module.exports = {
    Posts
};