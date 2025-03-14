function showSubOptions() {
    const specialitySelect = document.getElementById('speciality');
    const subOptionsDiv = document.getElementById('sub-options');
    const subOptionsDiv2 = document.getElementById('sub-options2');
    const country = document.getElementById('country').value;
console.log(country)
    if (specialitySelect.value === 'Docteur' && country === 'tunisie') {
        subOptionsDiv.style.display = 'block';
       
    } else {
        subOptionsDiv.style.display = 'none';
    }

    if (specialitySelect.value === 'Docteur' && country === 'france') {
        subOptionsDiv2.style.display = 'block';
       
    } else {
        subOptionsDiv2.style.display = 'none';
    }

}
