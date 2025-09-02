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