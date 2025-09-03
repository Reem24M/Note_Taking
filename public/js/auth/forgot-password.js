/**
 * Handles the "Forgot Password" form submission.
 * - Prevents the default form submission behavior.
 * - Collects the user's email from the input field.
 * - Sends a POST request to /auth/forgot-password with the email.
 * - Displays success message if the reset link is sent.
 * - Redirects the user to the login page after submission.
 * - Handles and shows error messages if the request fails.
*/
document.getElementById("forgotForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;

  try {
    const response = await axios.post("/auth/forgot-password", { email });

    if (response.data && response.data.message) {
      alert(response.data.message);
    } else {
      alert("Reset link sent to your email.");
    }

  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "Error sending reset link");
  }
});
