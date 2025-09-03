/**
 * Handles user logout when the logout button is clicked.
 * - Waits for the DOM to be fully loaded.
 * - Selects the logout button (if it exists).
 * - On click:
 *   - Sends a DELETE request to /auth/logout using axios.
 *   - If the response is successful, shows a "Logged out successfully" alert.
 *   - Otherwise, shows an error alert.
 * - Catches and logs any errors during the request.
 */

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
