const categoriesList = document.getElementById("categoriesList");
const addCategoryBtn = document.getElementById("addCategoryBtn");
const newCategoryName = document.getElementById("newCategoryName");

async function fetchCategories() {
  try {
    const response = await axios.get("/api/categories", {
      headers: {
        token: localStorage.getItem("token"),
      },
    });
    console.log("this ",response);
    categoriesList.innerHTML = ""; 
    response.data.all.forEach((category) => {
      const li = document.createElement("li");
      li.textContent = category.name;

      const delBtn = document.createElement("button");
      delBtn.textContent = "Delete";
      delBtn.style.marginLeft = "10px";
      delBtn.onclick = () => deleteCategory(category._id);

      li.appendChild(delBtn);
      categoriesList.appendChild(li);
    });
  } catch (err) {
    console.error(err);
    alert("Error fetching categories");
  }
}

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
    alert(response.data.message);
    newCategoryName.value = "";
    fetchCategories();
  } catch (err) {
    console.error(err);
    alert("Error adding category");
  }
}

async function deleteCategory(id) {
  if (!confirm("Are you sure you want to delete this category?")) return;

  try {
    const response = await axios.delete(`/categories/${id}`, {
      headers: {
        token: localStorage.getItem("token"),
      },
    });
    alert(response.data.message || "Category deleted");
    fetchCategories();
  } catch (err) {
    console.error(err);
    alert("Error deleting category");
  }
}

addCategoryBtn.addEventListener("click", addCategory);
fetchCategories();
