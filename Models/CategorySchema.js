const mongoose=require('mongoose')
const { v4: uuidv4 } = require('uuid');

const CategorySchema=new mongoose.Schema({
    _id:{
        type:String,
        default:uuidv4
    },
    name:{
        type:String,
        required:true,
        unique:true
    },
    ownerUsername:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})
const CategoryData=mongoose.model('Categories',CategorySchema)
module.exports={CategoryData}