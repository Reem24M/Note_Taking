const { NoteData } = require("../../Models/NoteSchema")
const { v4: uuidv4 } = require('uuid');
const { SessionData } = require('../../Models/SessionSchema')

// Get all notes for the logged-in user
const GetAllNotes = async (req, res) => {
    // 1. Check authentication (token in headers)
    let token = req.headers.token
    if (!token)
        return res.status(200).send("Not authenticated")

    // 2. Validate session using token
    let user = await SessionData.findOne({ token })
    if (!user)
        return res.status(200).send("Not authenticated")

    // 3. Find all notes owned by the logged-in user
    let notes = await NoteData.find({ ownerUsername: user.username })
    if (!notes) return res.status(400).send("No notes found")

    // 4. Return notes
    return res.status(200).json({ notes })
}

// Get a single note by its ID
const GetNoteById = async (req, res) => {
    // 1. Check authentication
    let token = req.headers.token
    if (!token)
        return res.status(200).send("Not authenticated")

    // 2. Validate session
    let user = await SessionData.findOne({ token })
    if (!user)
        return res.status(200).send("Not authenticated")

    // 3. Get note ID from request params
    let { id } = req.params
    if (!id) return res.status(400).send("ID is required")

    // 4. Find the note owned by this user
    let note = await NoteData.findOne({ _id: id, ownerUsername: user.username })
    if (!note) return res.status(404).send("Note not found")

    // 5. Return note
    return res.status(200).json({ note })
}

// Add a new note
const AddNote = async (req, res) => {
    // 1. Check authentication
    let token = req.headers.token
    if (!token)
        return res.status(200).send("Not authenticated")

    // 2. Validate session
    let user = await SessionData.findOne({ token })
    if (!user)
        return res.status(200).send("Not authenticated")

    // 3. Get required fields from request body
    let { title, content, categoryName } = req.body
    if (!title || !content || !categoryName)
        return res.status(400).send('All fields are required')

    // 4. Create a new note object
    let newnote = new NoteData({
        _id: uuidv4(),
        title,
        content,
        ownerUsername: user.username,
        categoryName
    })

    // 5. Save note to database
    await newnote.save()

    // 6. Return the created note
    return res.status(201).json({ note: newnote })
}

// Update a full note (all fields)
const UpdateNote = async (req, res) => {
    // 1. Check authentication
    let token = req.headers.token
    if (!token)
        return res.status(200).send("Not authenticated")

    // 2. Validate session
    let user = await SessionData.findOne({ token })
    if (!user)
        return res.status(200).send("Not authenticated")

    // 3. Get note ID
    let { id } = req.params
    if (!id) return res.status(400).send("ID is required")

    // 4. Find note by ID and owner
    let note = await NoteData.findOne({ _id: id, ownerUsername: user.username })
    if (!note) return res.status(404).send("Note not found")

    // 5. Get updated fields
    let { title, content, categoryName } = req.body
    if (!title || !content || !categoryName)
        return res.status(400).send("All fields are required")

    // 6. Update note values
    note.title = title
    note.content = content
    note.categoryName = categoryName

    // 7. Save changes
    await note.save()

    // 8. Return updated note
    return res.status(200).json({ note })
}

// Update only one or more fields (partial update)
const UpdateNoteWithOneThing = async (req, res) => {
  try {
    // 1. Check authentication
    let token = req.headers.token;
    if (!token)
      return res.status(401).send("Not authenticated");

    // 2. Validate session
    let user = await SessionData.findOne({ token });
    if (!user)
      return res.status(401).send("Not authenticated");

    // 3. Get note ID
    let { id } = req.params;
    if (!id) return res.status(400).send("ID is required");

    // 4. Find note owned by user
    const note = await NoteData.findOne({ _id: id, ownerUsername: user.username });
    if (!note) return res.status(404).send("Note not found");

    // 5. Build updates object (only for provided fields)
    const updates = {};
    if (req.body.title !== undefined) updates.title = req.body.title;
    if (req.body.content !== undefined) updates.content = req.body.content;
    if (req.body.categoryName !== undefined) updates.categoryName = req.body.categoryName;

    if (Object.keys(updates).length === 0) {
      return res.status(400).send("No fields to update");
    }

    // 6. Apply updates
    const updatenote = await NoteData.findOneAndUpdate(
      { _id: id, ownerUsername: user.username }, 
      { $set: updates },
      { new: true, runValidators: true } // return updated doc and validate
    );

    // 7. Save and return updated note
    await updatenote.save();
    return res.status(200).json({ updatenote });

  } catch (err) {
    console.error("Error updating note:", err);
    return res.status(500).send("Server error");
  }
};

// Delete a note by ID
const DeleteNote = async (req, res) => {
    // 1. Check authentication
    let token = req.headers.token
    if (!token)
        return res.status(200).send("Not authenticated")

    // 2. Validate session
    let user = await SessionData.findOne({ token })
    if (!user)
        return res.status(200).send("Not authenticated")

    // 3. Get note ID
    let { id } = req.params
    if (!id) return res.status(400).send("ID is required")

    // 4. Find note by ID and owner
    let note = await NoteData.findOne({ _id: id, ownerUsername: user.username })
    if (!note) return res.status(404).send("Note not found")

    // 5. Delete note
    await NoteData.deleteOne({ _id: id, ownerUsername: user.username })

    // 6. Return success with no content
    return res.status(204).json({ "ok": true })
}

module.exports = { GetAllNotes, GetNoteById, AddNote, UpdateNote, UpdateNoteWithOneThing, DeleteNote }
