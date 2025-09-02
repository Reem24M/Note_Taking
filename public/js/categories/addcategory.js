document.getElementById("addCategoryForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const token = localStorage.getItem("token");

  try {
    const response = await axios.post(
      "/categories/add",
      { name },
      {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      }
    );

    document.getElementById("message").innerText = response.data.message || "Category added successfully!";
    document.getElementById("message").style.color = "green";
  } catch (error) {
    document.getElementById("message").innerText =
      error.response?.data?.message || "Error adding category.";
    document.getElementById("message").style.color = "red";
  }
});
