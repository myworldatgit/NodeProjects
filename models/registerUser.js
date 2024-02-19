const mongoose=require('mongoose');
const registerSchema=new mongoose.Schema({
    email:
    {
        type:String,
        required:true,
        unique:true,

    },
    password:
    {
        type:String,
        required:true,
    },
    created:{
        type:Date,
        required:true,
        default:Date.now,
    },
});

module.exports= mongoose.model('registerUser',registerSchema);
