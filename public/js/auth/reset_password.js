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
    const token = urlParams.get("token");

    const response = await axios.post(
      "/auth/reset-password",
      {
        newpassword,
        confirmpassword,
      },
      {
        headers: {
          token: token, 
        },
      }
    );

    if (response.data && response.data.message) {
      alert(response.data.message);
    } else {
      alert("Password reset successfully.");
    }

    window.location.href = "/auth/login";
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "Error resetting password");
  }
});
