async function loadHome() {
  try {
    const res = await fetch("/", {
      method: "GET",
      headers: {
        "token": localStorage.getItem("token") 
      }
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text);
    }

    const data = await res.json();
    console.log("Categories:", data.categories);
    console.log("Notes:", data.notes);

    renderCategories(data.categories);
    renderNotes(data.notes);
  } catch (err) {
    console.error("Error loading home:", err);
  }
}

function renderCategories(categories) {
  const list = document.getElementById("categoriesList");
  list.innerHTML = "";
  categories.forEach(cat => {
    const li = document.createElement("li");
    li.textContent = cat.name;
    list.appendChild(li);
  });
}

function renderNotes(notes) {
  const list = document.getElementById("notesList");
  list.innerHTML = "";
  notes.forEach(note => {
    const li = document.createElement("li");
    li.classList.add("note");
    li.innerHTML = `
      <h3>${note.title}</h3>
      <p>${note.content}</p>
      <small>Category: ${note.categoryName}</small>
    `;
    list.appendChild(li);
  });
}

loadHome();
