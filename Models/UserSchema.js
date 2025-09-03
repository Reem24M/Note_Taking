const mongoose=require('mongoose')


const UserSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    },
    firstName:{
        type:String,
       
    },
    lastName:{
        type:String,
        
    },
    phoneNumber:{
        type:String,
        
    },
    address:{
        type:String,
       
    },
    passwordResetToken:{
        type:String,
        default:null
    },
    passwordResetTokenExpiry:{
        type:Date,
        default:null
    },
    otp:{
        type:String,
        default:null
       
    },
    otpExpiry:{
        type:String,
        default:null
       
       
    },
    otpEnabled:{
        type:Boolean,
        default:false
    }
})
const UserData=mongoose.model('Users',UserSchema)
module.exports={UserData}