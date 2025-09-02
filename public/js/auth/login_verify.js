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
