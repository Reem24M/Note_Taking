const notesList = document.getElementById("notesList");

const addNoteModal = document.getElementById("addNoteModal");
const editNoteModal = document.getElementById("editNoteModal");

let selectedNote = null;

/**
 * Opens the Add Note modal when the "openAddModal" button is clicked.
 * Closes the Add Note modal when the "closeAddModal" button is clicked.
 * Closes the Edit Note modal when the "closeEditModal" button is clicked.
 */
document.getElementById("openAddModal").onclick = () => addNoteModal.style.display = "flex";
document.getElementById("closeAddModal").onclick = () => addNoteModal.style.display = "none";
document.getElementById("closeEditModal").onclick = () => editNoteModal.style.display = "none";

/**
 * Fetches all notes from the server.
 * - Sends GET request to /api/notes with the token.
 * - If successful, parses response and calls renderNotes to display notes.
 * - Logs any error that occurs during fetch.
 */
async function fetchNotes() {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch("/api/notes", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "token": token
      }
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text);
    }

    const data = await res.json();
    console.log(data.notes);
    renderNotes(data.notes);
  } catch (err) {
    console.log("Error fetching notes:", err.message);
  }
}

/**
 * Renders notes into the DOM.
 * - Clears the notes list.
 * - For each note:
 *   - Creates an <li> element with the title and category.
 *   - Adds a delete button that removes the note via DELETE request.
 *   - Sets the <li> click handler to open the edit modal with note data.
 * - Appends all notes to the notes list.
 */
function renderNotes(notes) {
  notesList.innerHTML = "";
  notes.forEach(note => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${note.title}</strong> - ${note.categoryName} <button class="delete-btn">Delete</button>`;

    const deleteBtn = li.querySelector(".delete-btn");
    deleteBtn.onclick = async (e) => {
      e.stopPropagation();
      try {
        const res = await fetch(`/notes/${note._id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "token": localStorage.getItem("token")
          }
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text);
        }
        fetchNotes();
      } catch (err) {
        alert("Error deleting note: " + err.message);
      }
    };

    li.onclick = () => openEditModal(note);
    notesList.appendChild(li);
  });
}

/**
 * Handles adding a new note.
 * - Gets values from form inputs (title, category, content).
 * - Validates that title and content are not empty.
 * - Sends POST request to /notes with the note data.
 * - Refreshes the notes list and clears form fields on success.
 */
document.getElementById("addNoteBtn").onclick = async () => {
  const title = document.getElementById("noteTitle").value;
  const categoryName = document.getElementById("categoryName").value;
  const content = document.getElementById("noteContent").value;

  if (!title || !content) return alert("Title and Content required!");

  try {
    await fetch("/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "token": localStorage.getItem("token")
      },
      body: JSON.stringify({ title, categoryName, content })
    });

    fetchNotes();

    addNoteModal.style.display = "none";
    document.getElementById("noteTitle").value = "";
    document.getElementById("categoryName").value = "";
    document.getElementById("noteContent").value = "";
  } catch (err) {
    console.error("Error adding note:", err);
  }
};

/**
 * Opens the Edit Note modal and populates it with the selected note's data.
 * - Stores the selected note in a global variable.
 * - Sets form input values (title, category, content) with the note's data.
 */
function openEditModal(note) {
  selectedNote = note;
  document.getElementById("editNoteTitle").value = note.title;
  document.getElementById("editCategoryName").value = note.categoryName;
  document.getElementById("editNoteContent").value = note.content;
  editNoteModal.style.display = "flex";
}

/**
 * Saves changes to an existing note.
 * - Checks if a note is selected.
 * - Sends PUT request with updated note data to /notes/:id.
 * - Refreshes the notes list and closes the modal on success.
 */
document.getElementById("saveEditBtn").onclick = async () => {
  if (!selectedNote) return;

  try {
    await fetch(`/notes/${selectedNote._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "token": localStorage.getItem("token") },
      body: JSON.stringify({
        title: document.getElementById("editNoteTitle").value,
        content: document.getElementById("editNoteContent").value,
        categoryName: document.getElementById("editCategoryName").value
      })
    });

    fetchNotes();
    editNoteModal.style.display = "none";
  } catch (err) {
    console.error("Error updating note:", err);
  }
};

// Initial load of notes
fetchNotes();
