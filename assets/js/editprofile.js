const secretKey = "maCleSecrete"; // Define your secret key here
document.getElementById('cnam_checkbox').addEventListener('change', function () {
    const cnamSection = document.getElementById('cnam_section');
    cnamSection.style.display = this.checked ? 'block' : 'none';
});

document.getElementById('other_insurance_checkbox').addEventListener('change', function () {
    const otherInsuranceSection = document.getElementById('other_insurance_section');
    otherInsuranceSection.style.display = this.checked ? 'block' : 'none';
});
function validateProfileForm() {
    const firstName = document.getElementById('first_name').value.trim();
    const lastName = document.getElementById('last_name').value.trim();
    const phoneNumber = document.getElementById('phone_number').value.trim();
    const gender = document.getElementById('gender').value.trim();

    const warningMessage = document.getElementById('warning-message');
    if (!firstName || !lastName || !phoneNumber || !gender) {
        warningMessage.style.display = 'block';
    } else {
        warningMessage.style.display = 'none';
    }
}

// Valider au chargement de la page
document.addEventListener('DOMContentLoaded', function () {
    validateProfileForm();
});

// Valider à chaque modification d'un champ
document.querySelectorAll('#first_name, #last_name, #phone_number, #gender').forEach(function (input) {
    input.addEventListener('input', validateProfileForm);
});

// Vérifier aussi lors du clic sur le bouton
document.getElementById('updateProfileButton').addEventListener('click', function (e) {
    e.preventDefault();
    validateProfileForm();
    if (document.getElementById('warning-message').style.display === 'none') {
      //  alert('Profil mis à jour avec succès !');
        // Ici, ajouter la logique pour envoyer les données au serveur si nécessaire
    }
});
function decryptData(cipherText) {
    const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}

function encryptData(data) {
    return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
}

// Decrypt and retrieve user data from session storage
const authData = sessionStorage.getItem("auth");
if (authData) {
    console.log("authData: ",authData)
    const login = decryptData(authData);
    console.log("Initial login data: ", login);

    // Assuming the user's first name is in the result array
    const user = login.result[0]; // Get the first user object from the result array
    console.log("user: ", user)
    // Update the user name in the <h4> element
    const userNameElement = document.getElementById("user-name");
    userNameElement.textContent = `${JSON.parse(user.first_name).fr} ${JSON.parse(user.last_name).fr || ''}`; // Show first name and last name if available

    // Populate form fields with user data
    document.getElementById("first_name").value = JSON.parse(user.first_name).fr || '';
    document.getElementById("last_name").value = JSON.parse(user.last_name).fr  || '';
    document.getElementById("email").value = user.email || ''; // Use email for email field
    document.getElementById("phone_number").value = user.phone_number || '';
    document.getElementById("mobile_number").value = user.mobile_number || '';
    //document.getElementById("age").value = user.age || '';
    document.getElementById("gender").value = user.gender || '';
    document.getElementById("weight").value = user.weight || '';
    document.getElementById("height").value = user.height || '';
    document.getElementById("medical_history").value = user.medical_history || '';
    document.getElementById("notes").value = user.notes || '';
    document.getElementById("matriculeCNSS").value = user.matriculeCNSS || '';
    document.getElementById("dateExpiration").value = user.dateExpiration || '';
    document.getElementById("assurance").value = user.assurance || '';
    document.getElementById("groupe_sanguin").value = user.groupe_sanguin || '';
    document.getElementById("allergie").value = user.allergie || '';
    document.getElementById("date_naissance").value = new Date(user.date_naissance).toISOString().split('T')[0] || '';

    // Handle the insurance checkbox (CNAM and Assurance)
    if ((user.matriculeCNSS != "" || user.dateExpiration != "") & (user.matriculeCNSS != null || user.dateExpiration != null)) {
        document.getElementById("cnam_checkbox").checked = true;
        document.getElementById("cnam_section").style.display = 'block'; // Show CNSS matricule field
    }
    if ((user.assurance != "") & (user.assurance != null)) {
        document.getElementById("other_insurance_checkbox").checked = true;
        document.getElementById("other_insurance_section").style.display = 'block'; // Show assurance name field
    }


}


document.getElementById("updateProfileButton").addEventListener("click", async () => {
    const authData = sessionStorage.getItem("auth");
    const login = decryptData(authData);
    const patientId = login.result[0].id;

    // Initialize the updatedProfile object
    const updatedProfile = {};

    // Dynamically add fields to updatedProfile if they are not empty
    const firstName = document.getElementById("first_name").value;
    if (firstName) updatedProfile.first_name = firstName;

    const lastName = document.getElementById("last_name").value;
    if (lastName) updatedProfile.last_name = lastName;

    const email = document.getElementById("email").value;
    if (email) updatedProfile.email = email;

    const phoneNumber = document.getElementById("phone_number").value;
    if (phoneNumber) updatedProfile.phone_number = phoneNumber;

    const mobileNumber = document.getElementById("mobile_number").value;
    if (mobileNumber) updatedProfile.mobile_number = mobileNumber;

    /* const age = document.getElementById("age").value;
    if (age) updatedProfile.age = age; // Keep as string or parse to integer if needed */

    const gender = document.getElementById("gender").value;
    if (gender) updatedProfile.gender = gender;

    const weight = document.getElementById("weight").value;
    if (weight) updatedProfile.weight = weight;

    const height = document.getElementById("height").value;
    if (height) updatedProfile.height = height;

    const medicalHistory = document.getElementById("medical_history").value;
    if (medicalHistory) updatedProfile.medical_history = medicalHistory;

    const notes = document.getElementById("notes").value;
    if (notes) updatedProfile.notes = notes;

    const matriculeCNSS = document.getElementById("matriculeCNSS").value;
    if (matriculeCNSS) updatedProfile.matriculeCNSS = matriculeCNSS;

    const dateExpiration = document.getElementById("dateExpiration").value;
    if (dateExpiration) updatedProfile.dateExpiration = dateExpiration;

    const assurance = document.getElementById("assurance").value;
    if (assurance) updatedProfile.assurance = assurance;

    const groupeSanguin = document.getElementById("groupe_sanguin").value;
    if (groupeSanguin) updatedProfile.groupe_sanguin = groupeSanguin;

    const allergie = document.getElementById("allergie").value;
    if (allergie) updatedProfile.allergie = allergie;

    const dateNaissance = document.getElementById("date_naissance").value;
    if (dateNaissance) updatedProfile.date_naissance = dateNaissance;

    const nomAssurance = document.getElementById("assurance").value;
    if (nomAssurance) updatedProfile.assurance = nomAssurance;
    console.log("updatedProfile: ", JSON.stringify(updatedProfile))
    try {
        const response = await fetch(`https://wic-doctor.com:3004/update/patient/${patientId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedProfile), // Send only updated fields
        });

        const result = await response.json();
        if (response.ok) {
            console.log("response: ",response,result)

            alert(result.message);
            console.log('`{"fr":${updatedProfile.firstName}}`: ',`{"fr":${updatedProfile.first_name}}`,updatedProfile.first_name)
            updatedProfile.first_name=`{"fr":"${updatedProfile.first_name}"}`
            updatedProfile.last_name=`{"fr":"${updatedProfile.last_name}"}`

            // Update session storage with new profile data
            login.result[0] = {
                ...login.result[0],
                ...updatedProfile
            };

            // Re-encrypt and store the updated data in sessionStorage
            const updatedAuthData = encryptData(login);
            sessionStorage.setItem("auth", updatedAuthData);
console.log("")
            console.log("Session storage updated with: ", login);
            location.reload();
        } else {
            alert(result.error);
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        alert('An error occurred while updating the profile.');
    }
});

