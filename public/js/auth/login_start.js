/**
 * Handles the login form submission.
 * - Prevents the default form behavior to handle it via JavaScript.
 * - Collects form data and converts it into an object.
 * - Sends a POST request to /auth/login/start with the form data.
 * - If the response contains an error, shows it in an alert.
 * - If login starts successfully, shows a success message and resets the form.
 * - Logs any unexpected errors to the console.
*/    
  const form=document.getElementById('loginform');
    form.addEventListener('submit',async (e)=>{
      e.preventDefault();
      const formData=new FormData(form);
      const data=Object.fromEntries(formData);
      try{

          const response=await axios.post('/auth/login/start',data);
          console.log(response);
          const result=await response.data;
          if(result.error){
            alert(result.error);
          }else{
            alert('login start successful');
            form.reset();
          }
      }catch(error){
        console.log(error);
      }
    });