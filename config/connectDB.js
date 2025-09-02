const mongoose=require('mongoose')
const path=require('path')
require('dotenv').config({path:path.join(__dirname,'../.env')})


const connectDB=async()=>{
   try
   {

       mongoose.connect(process.env.DATABASE_URL,{
           useNewUrlParser:true,
           useUnifiedTopology:true
        }).then(()=>{
            console.log("DB connected")
        }).catch((err)=>{
            console.log("DB connection failed")
            console.log(err)
        })
   }catch(err){
       console.log("DB connection failed")
       console.log(err)
   }
}
module.exports={connectDB}
