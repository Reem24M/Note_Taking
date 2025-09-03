const { CategoryData } = require("../../Models/CategorySchema")
const { SessionData } = require("../../Models/SessionSchema")
const { v4: uuidv4 } = require('uuid');

// Get all categories for the logged-in user
const GetAllCategories = async (req, res) => {
    // 1. Get token from request headers
    let token = req.headers.token
    if (!token)
        return res.status(200).send("Not authenticated")

    // 2. Find session using token
    let user = await SessionData.findOne({ token })
    if (!user)
        return res.status(200).send("Not authenticated user")

    // 3. Find all categories owned by the logged-in user
    let all = await CategoryData.find({ ownerUsername: user.username })

    // 4. If no categories found
    if (!all) return res.status(400).send("No categories found")

    // 5. Return all categories
    return res.status(200).json(all)
}

// Create a new category
const CreateCategory = async (req, res) => {
    // 1. Get token from request headers
    let token = req.headers.token
    if (!token)
        return res.status(200).send("Not authenticated")

    // 2. Find session using token
    let user = await SessionData.findOne({ token })
    if (!user)
        return res.status(200).send("Not authenticated")

    // 3. Get category name from request body
    let { name } = req.body
    if (!name) return res.status(400).send("Name is required")

    // 4. Create new category object
    let newCategory = new CategoryData({
        _id: uuidv4(),
        name,
        ownerUsername: user.username,
        createdAt: new Date()
    })

    // 5. Save new category to database
    await newCategory.save()

    // 6. Send success response
    return res.status(200).json({ message: "Category created successfully", newCategory })
}

// Delete category by ID
const DeleteCategory = async (req, res) => {
    // 1. Get token from request headers
    let token = req.headers.token
    if (!token)
        return res.status(200).send("Not authenticated")

    // 2. Find session using token
    let user = await SessionData.findOne({ token })
    if (!user)
        return res.status(200).send("Not authenticated")

    // 3. Get category ID from request params
    let { id } = req.params
    if (!id) return res.status(400).send("ID is required")

    // 4. Find category by ID
    let category = await CategoryData.findOne({ _id: id })
    if (!category) return res.status(400).send("Category not found")

    // 5. Delete category
    await CategoryData.deleteOne({ _id: id })

    // 6. Send success response
    return res.status(200).send({ "ok": true })
}

module.exports = { GetAllCategories, CreateCategory, DeleteCategory }
