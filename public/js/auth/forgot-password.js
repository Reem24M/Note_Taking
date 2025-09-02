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

    window.location.href = "/auth/login";
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "Error sending reset link");
  }
});
