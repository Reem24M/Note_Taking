/**
 * Loads the home page data (categories + notes) from the server and updates the DOM.
 * - Gets the token from localStorage.
 * - Sends a GET request to the root endpoint ("/") with token in headers.
 * - Validates the response; throws an error if request fails.
 * - Parses the JSON response into categories and notes.
 * - Calls renderCategories to display categories in the DOM.
 * - Calls renderNotes to display notes in the DOM.
 * - Logs errors if fetching or rendering fails.
 */
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

/**
 * Renders the list of categories on the page.
 * - Selects the "categoriesList" element in the DOM.
 * - Clears existing content.
 * - Iterates through the categories array.
 * - Creates <li> elements with the category name.
 * - Appends each <li> to the categories list.
 */
function renderCategories(categories) {
  const list = document.getElementById("categoriesList");
  list.innerHTML = "";
  categories.forEach(cat => {
    const li = document.createElement("li");
    li.textContent = cat.name;
    list.appendChild(li);
  });
}

/**
 * Renders the list of notes on the page.
 * - Selects the "notesList" element in the DOM.
 * - Clears existing content.
 * - Iterates through the notes array.
 * - Creates <li> elements for each note and adds the "note" class.
 * - Populates each note with title, content, and category name.
 * - Appends each note to the notes list in the DOM.
 */
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
