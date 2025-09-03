const categoriesList = document.getElementById("categoriesList");
const addCategoryBtn = document.getElementById("addCategoryBtn");
const newCategoryName = document.getElementById("newCategoryName");

// Fetch all categories from the server and render them in the UI
async function fetchCategories() {
  try {
    const response = await axios.get("/api/categories", {
      headers: {
        token: localStorage.getItem("token"),
      },
    });

    // Clear the list before rendering new categories
    categoriesList.innerHTML = ""; 
    
    // Loop through each category and create list items
    response.data.forEach((category) => {
      const li = document.createElement("li");
      li.textContent = category.name;

      // Create delete button for each category
      const delBtn = document.createElement("button");
      delBtn.textContent = "Delete";
      delBtn.style.marginLeft = "10px";
      delBtn.onclick = () => deleteCategory(category._id);

      // Append delete button to the list item
      li.appendChild(delBtn);

      // Add list item to the categories list
      categoriesList.appendChild(li);
    });
  } catch (err) {
    console.error(err);
    alert("Error fetching categories");
  }
}

// Add a new category by sending a POST request to the server
async function addCategory() {
  const name = newCategoryName.value.trim();
  if (!name) {
    alert("Please enter a category name");
    return;
  }

  try {
    const response = await axios.post(
      "/categories",
      { name },
      {
        headers: {
          token: localStorage.getItem("token"),
        },
      }
    );

    // Show response message and clear input
    alert(response.data.message);
    newCategoryName.value = "";

    // Refresh the categories list
    fetchCategories();
  } catch (err) {
    console.error(err);
    alert("Error adding category");
  }
}

// Delete a category by its ID after confirmation
async function deleteCategory(id) {
  if (!confirm("Are you sure you want to delete this category?")) return;

  try {
    const response = await axios.delete(`/categories/${id}`, {
      headers: {
        token: localStorage.getItem("token"),
      },
    });

    // Show success message and refresh list
    alert(response.data.message || "Category deleted");
    fetchCategories();
  } catch (err) {
    console.error(err);
    alert("Error deleting category");
  }
}

// Add event listener to "Add Category" button
addCategoryBtn.addEventListener("click", addCategory);

// Fetch categories when the page loads
fetchCategories();
