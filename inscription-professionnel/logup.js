document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector('.php-email-form');
    
 
   
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
       
        let phone = localStorage.getItem('phone');
        console.log('log' , phone);

     
        const prenomField = form.querySelector('input[name="name"]').value;
        const name = prenomField.charAt(0).toUpperCase() + prenomField.slice(1).toLowerCase();
        const nomField = form.querySelector('input[name="lastname"]').value;
        const lastname = nomField.charAt(0).toUpperCase() + nomField.slice(1).toLowerCase();
        const sexe = form.querySelector('select[id="sexe"]').value;
        const email = form.querySelector('input[name="email"]').value;
     //   const phone = form.querySelector('input[name="phone"]').value; // Ensure this matches the name in the form
        const type = form.querySelector('select[id="speciality"]').value;
        const speciality_id = parseInt(form.querySelector('select[id=options]').value || 0 );
        const speciality_id2 = parseInt(form.querySelector('select[id=options2]').value || 0 );
   
    
      

        const description = form.querySelector('textarea[name="message"]').value;
        const pays = form.querySelector('select[id="country"]').value ;
        const adresse = form.querySelector('input[name="adresse"]').value ;
        const code_parent = form.querySelector('input[name="code"]').value ;
        console.log(pays);

        if (pays == "tunisie") {
            const gouvernorat = form.querySelector('select[id="province"]').value ;  
            const  ville = form.querySelector('select[id="city"]').value ;
         
            const departement = "" ;
            const  region = "" ;
        
        
            console.log(name,lastname , email, phone, type, speciality_id, description , pays , adresse , ville , gouvernorat , departement, region , sexe , code_parent)
        
            try {
                const response = await fetch('https://wic-doctor.com:3004/api/logupb2b', { 
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    }, 
                    body: JSON.stringify({ name,lastname , email, phone, type, speciality_id, description , pays , adresse , ville , gouvernorat , departement, region, sexe , code_parent}),
                });
                
    
                const data = await response.json();
    
                if (!response.ok) {
                    throw new Error(data.error || 'Une erreur est survenue lors de l\'inscription.');
                }
    
               //alert('Inscription réussie ! ' + data.message); // Show success message
           
                form.reset(); // Reset the form after submission
                localStorage.clear();

                window.location.href = 'https://wic-doctor.com/inscription-professionnel/validation-inscription.html';
    
            } catch (error) {
                console.error('Error:', error);
                alert(error.message); // Show error message
            } 
           
        }
        if (pays == "france") {
             const departement = form.querySelector('select[id="province"]').value ;
            const  region = form.querySelector('select[id="city"]').value ;
            const code_parent = form.querySelector('input[name="code"]').value ;
            const gouvernorat = "" ;
            const  ville = "" ;
            
            const speciality_id = speciality_id2 || 0 ;
            let phone = localStorage.getItem('phone');
        console.log('log' , phone);
            console.log(name,lastname , email, phone, type, speciality_id2, description , pays , adresse , ville , gouvernorat , departement, region , sexe , code_parent)
            try {
                const response = await fetch('https://wic-doctor.com:3004/api/logupb2b', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    }, 
                    body: JSON.stringify({ name,lastname , email, phone, type, speciality_id, description , pays , adresse , ville , gouvernorat , departement, region , sexe , code_parent}),
                });
    
                const data = await response.json();
    
                if (!response.ok) {
                    throw new Error(data.error || 'Une erreur est survenue lors de l\'inscription.');
                }
    
              // alert('Inscription réussie ! ' + data.message); // Show success message
                form.reset(); // Reset the form after submission
                localStorage.clear();
                window.location.href = 'https://wic-doctor.com/inscription-professionnel/validation-inscription.html';
    
            } catch (error) {
                console.error('Error:', error);
                alert(error.message); // Show error message
            } 
        }
        

        /* try {
            const response = await fetch('https://wic-doctor.com:3004/api/logupb2b', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }, 
                body: JSON.stringify({ name,lastname , email, phone, type, speciality_id, description , pays , adresse , ville , gouvernorat , departement, region}),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Une erreur est survenue lors de l\'inscription.');
            }

           alert('Inscription réussie ! ' + data.message); // Show success message
            form.reset(); // Reset the form after submission

        } catch (error) {
            console.error('Error:', error);
            alert(error.message); // Show error message
        }  */
    }); 
});
