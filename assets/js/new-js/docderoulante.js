function showSubOptions() {
    const specialitySelect = document.getElementById('speciality');
    const subOptionsDiv = document.getElementById('sub-options');

    if (specialitySelect.value === 'Docteur') {
        subOptionsDiv.style.display = 'block';
    } else {
        subOptionsDiv.style.display = 'none';
    }
}
