const express=require('express');
const path=require('path');
const app=express();
const {connectDB}=require('./config/connectDB');
const { mongoose } = require('mongoose');
app.use(express.json());
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,'public')));
app.set('json spaces',2)
connectDB();

mongoose.connection.once('open',()=>{
    console.log("MongoDB connected");
    app.listen(process.env.PORT,()=>{
        console.log(`Server is running on port ${process.env.PORT}`);
    });
});
mongoose.connection.on('error',(err)=>{
    console.log("MongoDB connection error");
    console.log(err);
});

// app.listen(3000,()=>{
//     connectDB();
//     console.log("Server is running on port 3000");
// });

module.exports={app};