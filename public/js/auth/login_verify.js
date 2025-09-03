/**
 * Handles the login verification form submission.
 * - Prevents the default form submission to handle it via JavaScript.
 * - Collects form data and converts it into an object.
 * - Sends a POST request to /auth/login/verify with the form data.
 * - If the response contains an error, displays it in an alert.
 * - If verification is successful:
 *    - Stores the received token in localStorage (if available).
 *    - Shows a success message and resets the form.
 * - Logs any error details to the console for debugging.
 */



const form = document.getElementById('loginform');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    try {
        const response = await axios.post('/auth/login/verify', data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = response.data;
        if (result.error) {
            alert(result.error);
        } else {
            if (result.token) {
                localStorage.setItem("token", result.token);
                console.log("Token stored:", result.token);
            }

            alert('Verification successful');
            form.reset();
        }
    } catch (error) {
        console.error("Login verify error:", error.response?.data || error.message);
    }
});
