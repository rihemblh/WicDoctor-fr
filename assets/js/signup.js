// Ensure you include this script at the bottom of your HTML file

let valid
console.log("phoneInputField: ", phoneInputField)
document.getElementById('Register').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent the default form submission
    if (!validatePhoneNumber()) {
        event.preventDefault();  // Empêche la soumission du formulaire
        //alert("Le formulaire a été soumis avec succès !");
        // Envoyer le formulaire ou exécuter une autre action ici
        return;
    }
    // Gather form data
    const name = this.name.value;
    const lastname = this.lastname.value;

    const phone = this.tel.value;
    const email = this.mail.value;

    console.log("JSON.stringify({ name,lastname, email, phone }: ", JSON.stringify({ name, lastname, email, phone }))
    try {
        var button = document.getElementById('inscription');

        // Disable the button
        button.disabled = true;
        // Send POST request to the API
        const response = await fetch('https://wic-doctor.com:3004/api/logup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, lastname, email, phone }),
        });
        var button = document.getElementById('inscription');

        // Disable the button
        button.disabled = false;
        const data = response;
        console.log("reponse:", data);
        if (response.ok) {
            alert(data.message || 'Inscription réussie! Vérifiez votre email / téléphone pour confirmer.');
            window.location.href = 'login.html'; // Redirect to index.html

        }
        else if (response.status === 409) {
            const errorData = await response.json();
          /*   if (errorData.error.includes('téléphone')) {
                // Disable the button
                button.disabled = false;
                showError("Le numéro de téléphone est déjà utilisé.");
            } if (errorData.error.includes('e-mail')) {
                // Disable the button
                button.disabled = false;
                showErrorMail("L'adresse e-mail est déjà utilisée.");
            }
            else { */
                // Si la réponse n'est pas ok, récupérer les erreurs
                
                if (errorData.errors) {
                    // Afficher toutes les erreurs retournées
                    errorData.errors.forEach(error => {
                        if(error== "Le numéro de téléphone est déjà utilisé.")
                        showError(error);
                        else if(error== "L'adresse e-mail est déjà utilisée.")
                        showErrorMail(error);
                    else{
                        showError(error);
                        showErrorMail(error);
                    }
                    });
                } else {
                    // Si aucune erreur spécifique n'est renvoyée, afficher une erreur générique
                    showError(errorData.error || 'Une erreur inconnue est survenue.');
                }
        }
    } catch (error) {
        var button = document.getElementById('inscription');

        // Disable the button
        button.disabled = false;
        console.error('Erreur lors de l\'inscription:', error);
        alert('Une erreur est survenue. Veuillez réessayer.');
    }
});
var iti
var phoneInputField
document.addEventListener("DOMContentLoaded", function () {

    var phoneInput = document.querySelector("#phone");
    phoneInputField = document.getElementById("phone");
    console.log("phoneInput: ", phoneInput, "phoneInputField: ", phoneInputField)
    iti = window.intlTelInput(phoneInputField, {
        initialCountry: "tn", // Le pays initial sera déterminé automatiquement selon la position de l'utilisateur
        geoIpLookup: function (callback) {
            fetch("https://ipinfo.io")
                .then(response => response.json())
                .then(data => callback(data.country))
                .catch(() => callback("tn")); // Si la géolocalisation échoue, utiliser "US" comme valeur par défaut
        },
        utilsScript: "./utils.js", // Remplacez `path/to/` par le chemin correct vers votre fichier utils.js
        loadUtilsOnInit: true, // Nouvelle méthode pour charger les utilitaires


    });
    phoneInputField.value = "+216";
    // Mettre à jour la valeur du champ quand le pays change
    phoneInputField.addEventListener("countrychange", function () {
        const dialCode = itiInstance.getSelectedCountryData().dialCode;
        contactField.value = `+${dialCode} `;
    });
    const contactFieldname = document.getElementById('name');
    const contactFieldlast = document.getElementById('lastname')
    const contactFieldtel = document.getElementById('phone');
    const contactFieldemail = document.getElementById('mail');
    ;
    contactFieldname.addEventListener('input', () => {
        var button = document.getElementById('inscription');

        // Disable the button
        button.disabled = false;
    })
    contactFieldlast.addEventListener('input', () => {
        var button = document.getElementById('inscription');

        // Disable the button
        button.disabled = false;
    })
    contactFieldemail.addEventListener('input', () => {
        var button = document.getElementById('inscription');

        // Disable the button
        button.disabled = false;
    })
    contactFieldtel.addEventListener('input', () => {
        var button = document.getElementById('inscription');

        // Disable the button
        button.disabled = false;
    })
});
// Affiche une erreur visuelle
function showError(message) {
    phoneInputField = document.getElementById("phone");

    const phoneInputContainer = phoneInputField.closest(".tel");
    let errorMessage = phoneInputContainer.querySelector(".error-message");

    // Créer un message d'erreur si absent
    if (!errorMessage) {
        errorMessage = document.createElement("div");
        errorMessage.classList.add("error-message");
        phoneInputContainer.appendChild(errorMessage);
    }

    // Afficher l'erreur
    errorMessage.innerText = message;
    errorMessage.style.display = "block";
    phoneInputField.classList.add("error");
}
// Affiche une erreur visuelle
function showErrorMail(message) {
    mailInputField = document.getElementById("mail");

    const mailInputContainer = mailInputField.closest(".mail");
    let errorMessage = mailInputContainer.querySelector(".error-message");

    // Créer un message d'erreur si absent
    if (!errorMessage) {
        errorMessage = document.createElement("div");
        errorMessage.classList.add("error-message");
        mailInputContainer.appendChild(errorMessage);
    }

    // Afficher l'erreur
    errorMessage.innerText = message;
    errorMessage.style.display = "block";
    mailInputField.classList.add("error");
}

// Supprime les erreurs visuelles
function clearError() {
    const phoneInputContainer = phoneInputField.closest(".tel");
    const errorMessage = phoneInputContainer.querySelector(".error-message");

    if (errorMessage) {
        errorMessage.style.display = "none";
    }
    phoneInputField.classList.remove("error");
}
// Fonction qui ajoute `validLength` en fonction du code pays
function addValidLengthToCountry(country) {
    const dialCode = country.dialCode;

    // Vérifie si l'indicatif pays est dans notre dictionnaire
    if (phoneLengthByCountry[dialCode]) {
        country.validLength = phoneLengthByCountry[dialCode];
    } else {
        country.validLength = null; // Si aucun correspondant n'est trouvé, on attribue `null`
    }

    return country;
}
const phoneLengthByCountry = {
    "1": 10,   // USA, Canada
    "33": 9,   // France
    "44": 10,  // Royaume-Uni
    "49": 11,  // Allemagne
    "39": 9,   // Italie
    "61": 9,   // Australie
    "91": 10,  // Inde
    "55": 10,  // Brésil
    "216": 8,  // Tunisie
    "34": 9,   // Espagne
    "81": 10,  // Japon
    "7": 10,   // Russie
    "52": 10,  // Mexique
    "34": 9,   // Espagne
    "20": 9,   // Egypte
    "61": 9,   // Australie
    "977": 10, // Népal
    "31": 9,   // Pays-Bas
    "62": 10,  // Indonésie
    "90": 10,  // Turquie
    "27": 9,   // Afrique du Sud
    "30": 10,  // Grèce
    "1": 10,   // USA
    "41": 9,   // Suisse
    "46": 10,  // Suède
    "64": 9,   // Nouvelle-Zélande
    "63": 10,  // Philippines
    "254": 9,  // Kenya
    "256": 9,  // Ouganda
    "233": 9,  // Ghana
    "254": 9,  // Kenya
    "254": 9,  // Kenya
    "27": 9,   // Afrique du Sud
    "40": 10,  // Roumanie
    "46": 10,  // Suède
    "20": 9,   // Egypte
    "48": 9,   // Pologne
    "55": 10,  // Brésil
    "54": 10   // Argentine
};

// Fonction qui ajoute `validLength` en fonction du code pays
function addValidLengthToCountry(country) {
    const dialCode = country.dialCode;

    // Vérifie si l'indicatif pays est dans notre dictionnaire
    if (phoneLengthByCountry[dialCode]) {
        country.validLength = phoneLengthByCountry[dialCode];
    } else {
        country.validLength = null; // Si aucun correspondant n'est trouvé, on attribue `null`
    }

    return country;
}
let selectedCountryData
function validatePhoneNumber() {

    // Récupérer le numéro complet et la validité
    const phoneNumber = phoneInputField = document.getElementById("phone").value;

    const isValid = iti.isValidNumber();
    selectedCountryData = iti.getSelectedCountryData();

    console.log("Numéro complet :", phoneNumber || "Vide");
    console.log("Est valide :", isValid);
    console.log("Pays sélectionné :", JSON.stringify(selectedCountryData));

    selectedCountryData = addValidLengthToCountry(selectedCountryData);
    // Vérifier si la longueur du numéro est correcte après l'indicatif pays
    const phoneWithoutCode = phoneNumber.replace(`+${selectedCountryData.dialCode}`, '').replace(' ', '').trim();

    if (phoneWithoutCode.length && phoneWithoutCode.length === selectedCountryData.validLength) {
        console.log("valid: ", phoneWithoutCode.length === selectedCountryData.validLength)
        valid = true;
    }
    else {
        valid = false
    }
    if (!valid) {
        console.log('valid: ', valid)
        document.getElementById("error-phone").style.display = "block"
        return false;
    }
    else {
        document.getElementById("error-phone").style.display = "none"
        return true;

    }


}



// Ajouter un écouteur à la soumission du formulaire

document.getElementById('Register').addEventListener('submit', function (event) {

    // Récupérer les champs de saisie
    const name = document.querySelector('input[name="name"]');
    const lastname = document.querySelector('input[name="lastname"]');
    const password = document.querySelector('input[name="password"]');
    const tel = document.querySelector('input[name="tel"]');
    const mail = document.querySelector('input[name="mail"]');

    // Validation du nom
    if (name.value.trim() === "" || name.value.length < 2 || name.value.length > 50) {
        event.preventDefault();  // Empêche la soumission du formulaire
        alert('Nom est obligatoire')
            ;
        return;
    }
    console.log("!validatePhoneNumber():", !validatePhoneNumber())

    // Validation du nom
    if (lastname.value.trim() === "" || lastname.value.length < 2 || lastname.value.length > 50) {
        event.preventDefault();  // Empêche la soumission du formulaire
        alert('Prénom est obligatoire')

        return;
    }
    //validation tel+email
    if (tel.value.trim() === "" && mail.value.trim() === "") {
        event.preventDefault();  // Empêche la soumission du formulaire
        alert('Email ou Téléphone obligatoire')
        return;
    }

    // validation password
    /*   if (password.value.trim() === "" || password.value.length < 8) {
            event.preventDefault();  // Empêche la soumission du formulaire
            showPopupnom();
            showPopupnom();
            return;
        }*/


    // Validation de l'email
    const mailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    /*   if (!mailPattern.test(mail.value)) {
   
          
          
           event.preventDefault();
           showPopupmail();
           showPopupmail();
           return;
       }*/



});
function showPopupnom() {
    document.getElementById('popupnom').style.display = 'flex';
}
function showPopupnom() {
    document.getElementById('popuppwd').style.display = 'flex';
}

function closePopupnom() {
    document.getElementById('popupnom').style.display = 'none';
}


function showPopupmail() {
    document.getElementById('popupmail').style.display = 'flex';
}

function closePopupmail() {
    document.getElementById('popupmail').style.display = 'none';
}

function showPopupphone() {
    document.getElementById('popupphone').style.display = 'flex';
}

function closePopupphone() {
    document.getElementById('popupphone').style.display = 'none';
}
