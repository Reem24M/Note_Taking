document.getElementById("deleteCategoryForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const categoryId = document.getElementById("categoryId").value;
  const token = localStorage.getItem("token"); 

  try {
    const response = await axios.delete(`/categories/delete/${categoryId}`, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });

    document.getElementById("message").innerText =
      response.data.message || "Category deleted successfully!";
    document.getElementById("message").style.color = "green";
  } catch (error) {
    document.getElementById("message").innerText =
      error.response?.data?.message || "Error deleting category.";
    document.getElementById("message").style.color = "red";
  }
});
