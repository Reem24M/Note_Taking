const mongoose=require('mongoose')
const { v4: uuidv4 } = require('uuid');

const NoteSchema=new mongoose.Schema({
    _id:{
        type:String,
        default:uuidv4
    },
    title:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    ownerUsername:{
        type:String,
        required:true
    },
    categoryName:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

const NoteData=mongoose.model('Notes',NoteSchema)
module.exports={NoteData}