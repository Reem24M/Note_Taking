const { NoteData } = require("../../Models/NoteSchema")
const { v4: uuidv4 } = require('uuid');
const {SessionData}= require('../../Models/SessionSchema')


const GetAllNotes = async (req, res) => {
    // check authentication
    let token = req.headers.token
    if (!token)
        return res.status(200).send("Not authenticated")
    // find token in session schema
    let user = await SessionData.findOne({ token })
    if (!user)
        return res.status(200).send("Not authenticated")
    let notes = await NoteData.find({ ownerUsername: user.username })
    if (!notes) return res.status(400).send("No notes found")
    return res.status(200).json({ notes })
}
const GetNoteById = async (req, res) => {
    // check authentication
    let token = req.headers.token
    if (!token)
        return res.status(200).send("Not authenticated")
    // find token in session schema
    let user = await SessionData.findOne({ token })
    if (!user)
        return res.status(200).send("Not authenticated")
    let { id } = req.params
    if (!id) return res.status(400).send("ID is required")
    let note = await NoteData.findOne({ _id: id, ownerUsername: user.username })
    if (!note) return res.status(404).send("Note not found")
    return res.status(200).json({ note })
}
const AddNote = async (req, res) => {
    // check authentication
    let token = req.headers.token
    if (!token)
        return res.status(200).send("Not authenticated")
    // find token in session schema
    let user = await SessionData.findOne({ token })
    if (!user)
        return res.status(200).send("Not authenticated")
    let { title, content, categoryName } = req.body
    if (!title || !content || !categoryName)
        return res.status(400).send('All fields are required')
    let newnote = new NoteData({
        _id: uuidv4(),
        title,
        content,
        ownerUsername: user.username,
        categoryName
    })
    await newnote.save()
    return res.status(201).json({ note: newnote })
}
const UpdateNote=async(req,res)=>{
    // check authentication
    let token = req.headers.token
    if (!token)
        return res.status(200).send("Not authenticated")
    // find token in session schema
    let user = await SessionData.findOne({ token })
    if (!user)
        return res.status(200).send("Not authenticated")
    let {id}=req.params
    if(!id) return res.status(400).send("ID is required")
    let note =await NoteData.findOne({ _id: id, ownerUsername: user.username })
    if(!note) return res.status(404).send("Note not found")
     let {title,content,categoryName}=req.body
    if(!title || !content || !categoryName)
        return res.status(400).send("All fields are required")
    note.title = title
    note.content = content
    note.categoryName = categoryName
    await note.save()
    return res.status(200).json({ note })
}
const UpdateNoteWithOneThing = async (req, res) => {
  try {
    // check authentication
    let token = req.headers.token;
    if (!token)
      return res.status(401).send("Not authenticated");

    // find token in session schema
    let user = await SessionData.findOne({ token });
    if (!user)
      return res.status(401).send("Not authenticated");

    let { id } = req.params;
    if (!id) return res.status(400).send("ID is required");

    const note = await NoteData.findOne({ _id: id, ownerUsername: user.username });
    if (!note) return res.status(404).send("Note not found");

    const updates = {};
    if (req.body.title !== undefined) updates.title = req.body.title;
    if (req.body.content !== undefined) updates.content = req.body.content;
    if (req.body.categoryName !== undefined) updates.categoryName = req.body.categoryName;

    if (Object.keys(updates).length === 0) {
      return res.status(400).send("No fields to update");
    }

    const updatenote = await NoteData.findOneAndUpdate(
      { _id: id, ownerUsername: user.username }, 
      { $set: updates },
      { new: true, runValidators: true } 
    );
    await updatenote.save();
    if (!note) return res.status(404).send("Note not found");

    return res.status(200).json({ updatenote });
  } catch (err) {
    console.error("Error updating note:", err);
    return res.status(500).send("Server error");
  }
};
const DeleteNote=async(req,res)=>{
    // check authentication
    let token = req.headers.token
    if (!token)
        return res.status(200).send("Not authenticated")
    // find token in session schema
    let user = await SessionData.findOne({ token })
    if (!user)
        return res.status(200).send("Not authenticated")
    let { id } = req.params
    if (!id) return res.status(400).send("ID is required")
    let note = await NoteData.findOne({ _id: id, ownerUsername: user.username })
    if (!note) return res.status(404).send("Note not found")
    await NoteData.deleteOne({ _id: id, ownerUsername: user.username })
    return res.status(204).json({"ok": true})
}
module.exports = { GetAllNotes, GetNoteById, AddNote, UpdateNote, UpdateNoteWithOneThing, DeleteNote }