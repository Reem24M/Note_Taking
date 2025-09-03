/**
 * Loads the user's profile information from the server and updates the DOM.
 * - Gets the token from localStorage.
 * - Fetches profile data from /api/profile.
 * - Updates username, email, first name, last name, and OTP status in the DOM.
 * - Handles errors and alerts the user if not authenticated or fetch fails.
*/
async function loadProfile() {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Not authenticated. Please login.");
            return;
        }

        const res = await fetch("/api/profile", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "token": token
            }
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message || "Failed to load profile");
            return;
        }


        document.getElementById("username").textContent = data.username;

        document.getElementById("email").textContent = data.email;
        document.getElementById("fname").textContent = data.firstName || "Not set";
        document.getElementById("lname").textContent = data.lastName || "Not set";
        document.getElementById("otpCheckbox").checked = !!data.otpEnabled;
    } catch (err) {
        console.error(err);
        alert("Error loading profile");
    }
}

/**
 * Handles enabling or disabling OTP (two-factor authentication) when the checkbox is changed.
 * - Gets the token from localStorage.
 * - Sends the new OTP enabled value to /profile/enable-otp via POST.
 */
document.getElementById("otpCheckbox").addEventListener("change", async (e) => {
    const token = localStorage.getItem("token");
    const newValue = e.target.checked;

    const res = await fetch("/profile/enable-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json", "token": token },
        body: JSON.stringify({ otpEnabled: newValue })
    });
});

/**
 * Handles password change form submission, sends new password to the server.
 * - Prevents default form submission.
 * - Collects form data and converts to object.
 * - Sends new password to /profile/change-password via POST.
 * - Alerts the user with the result and reloads page on success.
*/
document.getElementById("changePasswordForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    const res = await fetch("/profile/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json", "token": localStorage.getItem("token") },
        body: JSON.stringify(data),
    });

    const result = await res.json();
    alert(result.message || "Password updated!");
    if (res.ok) location.reload();
});

/**
 * Handles first and last name change form submission, sends updated names to the server.
 * - Prevents default form submission.
 * - Collects form data and converts to object.
 * - Sends new names to /profile/change-first-last-name via POST.
 * - Alerts the user with the result and reloads page on success.
 */

document.getElementById("changeNameForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    const res = await fetch("/profile/change-first-last-name", {
        method: "POST",
        headers: { "Content-Type": "application/json", "token": localStorage.getItem("token") },
        body: JSON.stringify(data),
    });

    const result = await res.json();
    alert(result.message || "Name updated!");
    if (res.ok) location.reload();
});


loadProfile();