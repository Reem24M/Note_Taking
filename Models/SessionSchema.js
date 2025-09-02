const mongoose=require('mongoose')


const SessionSchema=new mongoose.Schema({
    username:{
        type:String,
    },
    token:{
        type:String,
        default:null
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    },
    createdAt:{
        type:Date,
        default:Date.now,
        expires:'1h'
    },
})

const SessionData=mongoose.model('Sessions',SessionSchema)
module.exports={SessionData}