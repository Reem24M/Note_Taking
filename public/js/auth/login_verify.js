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
        console.log(response);
        const result = await response.data;
        if (result.error) {
            alert(result.error);
        } else {
            alert('Verification successful');
            form.reset();
        }
    } catch (error) {
        console.log(error);
        // console.log(data);
    }
});