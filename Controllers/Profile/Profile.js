const { UserData } = require("../../Models/UserSchema")
const bcrypt=require('bcrypt')


const GetProfile=async(req,res)=>{
    // check authentication
    let token = req.headers.token
    if (!token)
        return res.status(200).send("Not authenticated")
    // find token in session schema
    let user = await SessionData.findOne({ token })
    if (!user)
        return res.status(200).send("Not authenticated")
    let Userdata=await UserData.findOne({username:user.username})
    if (!Userdata)
        return res.status(200).send("User not found")
    res.status(200).send(Userdata)
}
const ChangePassword=async(req,res)=>{
    // check authentication
    let token = req.headers.token
    if (!token)
        return res.status(200).send("Not authenticated")
    // find token in session schema
    let user = await SessionData.findOne({ token })
    if (!user)
        return res.status(200).send("Not authenticated")
    let{oldPassword,newPassword,confirmPassword}=req.body
    
    if(!oldPassword ||  !newPassword || !confirmPassword)
        return res.status(400).send("All fields are required")
    if( !oldPassword && (newPassword && confirmPassword))
        return res.status(400).send("Old password is required")
    if(newPassword!==confirmPassword)
        return res.status(400).send("Passwords do not match")
    let userdata=await  UserData.findOne({username:user.username})
    if(!userdata)
        return res.status(400).send("User not found")
    let Newpass=await bcrypt.hash(newPassword,10)
    userdata.password=Newpass
    await userdata.save()
    res.status(200).send("Updated successfully")
    
}
const ChangeLSName=async(req,res)=>{
    try{

        // check authentication
        let token = req.headers.token
        if (!token)
            return res.status(200).send("Not authenticated")
        // find token in session schema
        let user = await SessionData.findOne({ token })
        if (!user)
            return res.status(200).send("Not authenticated")
        let{firstName,lastName}=req.body
    if(!firstName && !lastName)
        return res.status(400).send(" change the firsname or last name")
    let userdata=await UserData.findOne({username:user.username})
    if(!userdata)
        return res.status(400).send("User not found")
    if(firstName)
        userdata.firstName=firstName
    if(lastName)
        userdata.lastName=lastName
    await userdata.save()
    res.status(200).send("Updated successfully")
}catch(error){return res.status(400).send("error",error)}
}
const EnableOtp=async(req,res)=>{
    try{
        // check authentication
        let token = req.headers.token
        if (!token)
            return res.status(200).send("Not authenticated")
        // find token in session schema
        let user = await SessionData.findOne({ token })
        if (!user)
            return res.status(200).send("Not authenticated")
        let userdata=await UserData.findOne({username:user.username})
        if(!userdata)
            return res.status(400).send("User not found")
        userdata.otpEnabled=true
        await userdata.save()
        res.status(200).send("OTP enabled successfully")
    }catch(error){
        console.log(error)
    }
}
module.exports={GetProfile,ChangePassword,ChangeLSName,EnableOtp}