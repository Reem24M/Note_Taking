document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      try {
        let response = await axios.delete("/auth/logout")

        if (response.ok) {
          alert( "Logged out successfully");
         
        } else {
          alert( "Something went wrong");
        }
      } catch (err) {
        console.error(err);
        alert("Error logging out");
      }
    });
  }
});
