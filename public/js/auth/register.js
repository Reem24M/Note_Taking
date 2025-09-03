/**
 * Handles user registration form submission.
 * - Selects the form with id "registerForm".
 * - Prevents the default form submission.
 * - Collects form data and converts it into an object.
 * - Sends the data to the server via POST request to /auth/register using axios.
 * - If the server responds with an error, shows it in an alert.
 * - If successful, alerts the user of success and resets the form.
 * - Catches and logs any errors during the request.
 */

const form=document.getElementById('registerForm');
    form.addEventListener('submit',async (e)=>{
      e.preventDefault();
      const formData=new FormData(form);
      const data=Object.fromEntries(formData);
      try{

          const response=await axios.post('/auth/register',data);
          console.log(response);
          const result=await response.data;
          if(result.error){
            alert(result.error);
          }else{
            alert('Registration successful');
            form.reset();
          }
      }catch(error){
        console.log(error);
      }
    });