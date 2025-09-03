const { CategoryData } = require("../Models/CategorySchema");
const { NoteData } = require("../Models/NoteSchema");
const { SessionData } = require("../Models/SessionSchema");

const Home = async (req, res) => {
  try {
    let token = req.headers.token;
    if (!token) return res.status(401).send("Not authenticated");

    let user = await SessionData.findOne({ token });
    if (!user) return res.status(401).send("Not authenticated");

    let categories = await CategoryData.find({ ownerUsername: user.username });
    let notes = await NoteData.find({ ownerUsername: user.username });

    if (!categories || categories.length === 0)
      return res.status(200).send("No categories found");
    if (!notes || notes.length === 0)
      return res.status(200).send("No notes found");

    res.status(200).json({ categories, notes });
  } catch (err) {
    console.error("Error in Home:", err);
    res.status(500).send("Server error");
  }
};

module.exports = { Home };
