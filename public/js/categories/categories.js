document.addEventListener("DOMContentLoaded", async () => {
  const listElement = document.getElementById("categoriesList");

  try {
    const response = await axios.get("/categories", {
      headers: {
        "Content-Type": "application/json"
      }
    });
    const categories = response.data.categories || [];

    if (categories.length === 0) {
      listElement.innerHTML = "<li>No categories found</li>";
      return;
    }

    categories.forEach(cat => {
      const li = document.createElement("li");
      li.textContent = cat.name; 
      listElement.appendChild(li);
    });
  } catch (err) {
    console.error(err);
    listElement.innerHTML = "<li>Error loading categories</li>";
  }
});
