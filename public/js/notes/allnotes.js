const notesList = document.getElementById("notesList");
const addNoteModal = document.getElementById("addNoteModal");

let selectedNote = null;

/**
 * Opens the Add Note modal when the "openAddModal" button is clicked.
 * Closes the Add Note modal when the "closeAddModal" button is clicked.
 */
document.getElementById("openAddModal").onclick = () => addNoteModal.style.display = "flex";
document.getElementById("closeAddModal").onclick = () => addNoteModal.style.display = "none";

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
      headers: { "Content-Type": "application/json", "token": token }
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text);
    }

    const data = await res.json();
    console.log("Fetched notes:", data.notes);
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
 *   - Sets the <li> click handler to redirect to note details page.
 * - Appends all notes to the notes list.
 */
function renderNotes(notes) {
  notesList.innerHTML = "";
  notes.forEach(note => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${note.title}</strong> - ${note.categoryName} <button class="delete-btn">Delete</button>`;

    // Delete button click handler
    const deleteBtn = li.querySelector(".delete-btn");
    deleteBtn.onclick = async (e) => {
      e.stopPropagation(); // Prevent redirect when clicking delete
      try {
        const res = await fetch(`/api/notes/${note._id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json", "token": localStorage.getItem("token") }
        });
        if (!res.ok) throw new Error(await res.text());
        fetchNotes();
      } catch (err) {
        alert("Error deleting note: " + err.message);
      }
    };

    // Clicking the note redirects to the details page with note ID as param
    li.onclick = () => {
      window.location.href = `/notes/${note._id}`;
    };

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
    await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json", "token": localStorage.getItem("token") },
      body: JSON.stringify({ title, categoryName, content })
    });

    fetchNotes();
    addNoteModal.style.display = "none";

    // Clear input fields
    document.getElementById("noteTitle").value = "";
    document.getElementById("categoryName").value = "";
    document.getElementById("noteContent").value = "";
  } catch (err) {
    console.error("Error adding note:", err);
  }
};

// Initial load of notes when the page loads
fetchNotes();
