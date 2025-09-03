const { CategoryData } = require("../Models/CategorySchema");
const { NoteData } = require("../Models/NoteSchema");
const { SessionData } = require("../Models/SessionSchema");

const Home = async (req, res) => {
  try {
    // 1. Check authentication - token must be provided in headers
    let token = req.headers.token;
    if (!token) return res.status(401).send("Not authenticated");

    // 2. Validate session using token
    let user = await SessionData.findOne({ token });
    if (!user) return res.status(401).send("Not authenticated");

    // 3. Get all categories for this user
    let categories = await CategoryData.find({ ownerUsername: user.username });

    // 4. Get all notes for this user
    let notes = await NoteData.find({ ownerUsername: user.username });

    // 5. Handle case: no categories found
    if (!categories || categories.length === 0)
      return res.status(200).send("No categories found");

    // 6. Handle case: no notes found
    if (!notes || notes.length === 0)
      return res.status(200).send("No notes found");

    // 7. Return both categories and notes in JSON response
    res.status(200).json({ categories, notes });
  } catch (err) {
    // 8. Handle unexpected errors
    console.error("Error in Home:", err);
    res.status(500).send("Server error");
  }
};

module.exports = { Home };
