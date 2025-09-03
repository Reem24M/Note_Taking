const notesList = document.getElementById("notesList");

const addNoteModal = document.getElementById("addNoteModal");
const editNoteModal = document.getElementById("editNoteModal");

let selectedNote = null;

document.getElementById("openAddModal").onclick = () => addNoteModal.style.display = "flex";
document.getElementById("closeAddModal").onclick = () => addNoteModal.style.display = "none";
document.getElementById("closeEditModal").onclick = () => editNoteModal.style.display = "none";


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

function openEditModal(note) {
  selectedNote = note;
  document.getElementById("editNoteTitle").value = note.title;
  document.getElementById("editCategoryName").value = note.categoryName;
  document.getElementById("editNoteContent").value = note.content;
  editNoteModal.style.display = "flex";
}

document.getElementById("saveEditBtn").onclick = async () => {
  if (!selectedNote) return;

  try {
    await fetch(`/notes/${selectedNote._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" ,"token":localStorage.getItem('token')},
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
fetchNotes();
