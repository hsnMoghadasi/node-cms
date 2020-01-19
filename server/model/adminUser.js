const mongoose = require('mongoose');
const AdminUser = mongoose.model('adminUser',{
    firsName:{
        type:String,
        required: true,
        trim:true,
    },
    lastName:{
        type:String,
        trim:true,
        required: true
    },
    userName:{
        type:String,
        createIndexes: true,
        trim: true,
        required: true
    },
    email:{
        type:String,
        trim:true,
        required: true
    },
    password:{
        type:String,
        trim:true,
        required: [true,'required']
    },
    registerDate:{
        type:Date
    }
})

module.exports = {
    AdminUser
};