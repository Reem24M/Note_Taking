/**
 * Handles password reset form submission.
 * - Selects the form with id "resetForm".
 * - Prevents default form submission.
 * - Gets the new password and confirm password values from the input fields.
 * - Checks if the passwords match, otherwise shows an alert and stops execution.
 * - Extracts the reset token from the URL query parameters.
 * - Sends a POST request to /auth/reset-password with the new password and confirm password,
 *   including the token in the request headers.
 * - If the server responds with a message, shows it in an alert.
 * - On success, alerts the user and redirects them to the login page.
 * - Catches and logs any errors that occur during the request.
 */


document.getElementById("resetForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const newpassword = document.getElementById("newpassword").value;
  const confirmpassword = document.getElementById("confirmpassword").value;

  if (newpassword !== confirmpassword) {
    alert("Passwords do not match!");
    return;
  }

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("passwordResetToken");

    const response = await axios.post(
      `/auth/reset-password?passwordResetToken=${token}`,
      {
        newPassword:newpassword,
        confirmPassword:confirmpassword,
      }
    );

    if (response.data && response.data.message) {
      alert(response.data.message);
    } else {
      alert("Password reset successfully.");
    }

  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "Error resetting password");
  }
});
