const notesList = document.getElementById("notesList");
const addNoteBtn = document.getElementById("addNoteBtn");
const newNoteTitle = document.getElementById("newNoteTitle");
const newNoteContent = document.getElementById("newNoteContent");
const getNoteBtn = document.getElementById("getNoteBtn");
const noteIdInput = document.getElementById("noteId");

async function fetchNotes() {
  try {
    const response = await axios.get("/api/notes", {
      headers: { token: localStorage.getItem("token") },
    });
    notesList.innerHTML = "";
    response.data.all.forEach(note => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${note.title}</strong>: ${note.content}`;

      const delBtn = document.createElement("button");
      delBtn.textContent = "Delete";
      delBtn.onclick = () => deleteNote(note._id);
      delBtn.style.marginLeft = "10px";

      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit All";
      editBtn.onclick = () => editNoteAll(note._id);
      editBtn.style.marginLeft = "5px";

      const editOneBtn = document.createElement("button");
      editOneBtn.textContent = "Edit One";
      editOneBtn.onclick = () => editNoteOneField(note._id);
      editOneBtn.style.marginLeft = "5px";

      li.appendChild(delBtn);
      li.appendChild(editBtn);
      li.appendChild(editOneBtn);
      notesList.appendChild(li);
    });
  } catch (err) {
    console.error(err);
    alert("Error fetching notes");
  }
}

async function addNote() {
  const title = newNoteTitle.value.trim();
  const content = newNoteContent.value.trim();
  if (!title || !content) return alert("Please enter title and content");

  try {
    const response = await axios.post(
      "/api/notes",
      { title, content },
      { headers: { token: localStorage.getItem("token") } }
    );
    alert(response.data.message || "Note added");
    newNoteTitle.value = "";
    newNoteContent.value = "";
    fetchNotes();
  } catch (err) {
    console.error(err);
    alert("Error adding note");
  }
}

async function deleteNote(id) {
  if (!confirm("Are you sure you want to delete this note?")) return;
  try {
    const response = await axios.delete(`/api/notes/${id}`, {
      headers: { token: localStorage.getItem("token") },
    });
    alert(response.data.message || "Note deleted");
    fetchNotes();
  } catch (err) {
    console.error(err);
    alert("Error deleting note");
  }
}

async function editNoteAll(id) {
  const title = prompt("Enter new title:");
  const content = prompt("Enter new content:");
  if (!title || !content) return;
  try {
    const response = await axios.put(
      `/api/notes/${id}`,
      { title, content },
      { headers: { token: localStorage.getItem("token") } }
    );
    alert(response.data.message || "Note updated");
    fetchNotes();
  } catch (err) {
    console.error(err);
    alert("Error editing note");
  }
}

async function editNoteOneField(id) {
  const field = prompt("Which field to edit? (title/content)").toLowerCase();
  if (field !== "title" && field !== "content") return alert("Invalid field");
  const value = prompt(`Enter new value for ${field}:`);
  if (!value) return;
  try {
    const response = await axios.patch(
      `/api/notes/${id}`,
      { [field]: value },
      { headers: { token: localStorage.getItem("token") } }
    );
    alert(response.data.message || "Note updated");
    fetchNotes();
  } catch (err) {
    console.error(err);
    alert("Error editing note");
  }
}

async function getNoteById() {
  const id = noteIdInput.value.trim();
  if (!id) return alert("Please enter Note ID");
  try {
    const response = await axios.get(`/api/notes/${id}`, {
      headers: { token: localStorage.getItem("token") },
    });
    alert(`Title: ${response.data.note.title}\nContent: ${response.data.note.content}`);
  } catch (err) {
    console.error(err);
    alert("Error fetching note by ID");
  }
}

addNoteBtn.addEventListener("click", addNote);
getNoteBtn.addEventListener("click", getNoteById);

fetchNotes();
