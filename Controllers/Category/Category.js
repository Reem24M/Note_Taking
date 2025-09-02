const { CategoryData } = require("../../Models/CategorySchema")
const { SessionData } = require("../../Models/SessionSchema")

const { v4: uuidv4 } = require('uuid');

const GetAllCategories=async(req,res)=>{
    let token=req.headers.token
    if(!token)
        return res.status(200).send("Not authenticated")
    let user=await SessionData.findOne({token})
    if(!user)
        return res.status(200).send("Not authenticated user")
    let all=await CategoryData.find()
    if(!all) return res.status(400).send("No categories found")
    return res.status(200).json({all})
}
const CreateCategory=async(req,res)=>{
    // check authentication
    let token=req.headers.token
    if(!token)
        return res.status(200).send("Not authenticated")
    // find token in session schema
    let user=await SessionData.findOne({token})
    if(!user)
        return res.status(200).send("Not authenticated")
    // take name form body of request
    let {name}=req.body
    if(!name) return res.status(400).send("Name is required")
        // add new category
    let newCategory=new CategoryData({
        _id: uuidv4(),
        name,
        ownerUsername : user.username,
        createdAt: new Date()
    })
    await newCategory.save()
    return res.status(200).json({message:"Category created successfully",newCategory})
}

const DeleteCategory=async(req,res)=>{
    // check authentication
    let token=req.headers.token
    if(!token)
        return res.status(200).send("Not authenticated")
    // find token in session schema
    let user=await SessionData.findOne({token})
    if(!user)
        return res.status(200).send("Not authenticated")
    let {id}=req.params
    if(!id) return res.status(400).send("ID is required")
        let category=await CategoryData.findOne({_id:id})
    if(!category) return res.status(400).send("Category not found")
    await CategoryData.deleteOne({_id:id})
    return res.status(200).send({"ok": true})
}
module.exports={GetAllCategories,CreateCategory,DeleteCategory}