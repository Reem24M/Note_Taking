let noteData = {}; // لتخزين البيانات الحالية
const noteTitleEl = document.getElementById("noteTitle");
const noteCategoryEl = document.getElementById("noteCategory");
const noteContentEl = document.getElementById("noteContent");

/**
 * Fetch the note by ID from URL
 */
// Get the ID from the URL path
const pathParts = window.location.pathname.split('/');
const noteId = pathParts[pathParts.length - 1];

async function fetchNote() {
  if (!noteId) return alert("Note ID missing!");

  try {
    const res = await fetch(`/api/notes/${noteId}`, {
      headers: { "Content-Type": "application/json", "token": localStorage.getItem("token") }
    });
    console.log(res);
    if (!res.ok) throw new Error(await res.text());
    noteData = await res.json();

    noteTitleEl.textContent = noteData.title;
    noteCategoryEl.textContent = noteData.categoryName;
    noteContentEl.textContent = noteData.content;
  } catch (err) {
    alert("Error fetching note: " + err.message);
  }
}


/**
 * Handles editing a single field via PATCH
 */
async function editField(field) {
  const newValue = prompt(`Edit ${field}:`, noteData[field]);
  if (newValue === null) return; // Cancel pressed

  try {
 const pathParts = window.location.pathname.split('/');
const noteId = pathParts[pathParts.length - 1];


    const res = await fetch(`/api/notes/${noteId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "token": localStorage.getItem("token") },
      body: JSON.stringify({ [field]: newValue })
    });

    if (!res.ok) throw new Error(await res.text());

    noteData[field] = newValue;
    document.getElementById(`note${field.charAt(0).toUpperCase() + field.slice(1)}`).textContent = newValue;

  } catch (err) {
    alert("Error updating field: " + err.message);
  }
}

/**
 * Handles editing all fields via PUT
 */
document.getElementById("editAllBtn").onclick = async () => {
  const newTitle = prompt("Edit Title:", noteData.title);
  const newCategory = prompt("Edit Category:", noteData.categoryName);
  const newContent = prompt("Edit Content:", noteData.content);
  if (!newTitle || !newCategory || !newContent) return;

  try {
   const pathParts = window.location.pathname.split('/');
const noteId = pathParts[pathParts.length - 1];


    const res = await fetch(`/api/notes/${noteId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "token": localStorage.getItem("token") },
      body: JSON.stringify({ title: newTitle, categoryName: newCategory, content: newContent })
    });

    if (!res.ok) throw new Error(await res.text());

    noteData.title = newTitle;
    noteData.categoryName = newCategory;
    noteData.content = newContent;

    noteTitleEl.textContent = newTitle;
    noteCategoryEl.textContent = newCategory;
    noteContentEl.textContent = newContent;

  } catch (err) {
    alert("Error updating note: " + err.message);
  }
};

// ربط أيقونات القلم لكل حقل
document.querySelectorAll(".edit-field-btn").forEach(btn => {
  btn.onclick = () => editField(btn.dataset.field);
});

// Fetch note initially
fetchNote();
