function showSubOptions() {
    const specialitySelect = document.getElementById('speciality');
    const subOptionsDiv = document.getElementById('sub-options');
    const country = document.getElementById('country').value;
 
   
    
console.log(country)
    if (specialitySelect.value === 'Docteur' ) {
        subOptionsDiv.style.display = 'block';
       
        
    } else {
        subOptionsDiv.style.display = 'none';
    }
}
