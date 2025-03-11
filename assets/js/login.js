const secretKey = "maCleSecrete";
// Fonction pour décrypter
function decryptData(cipherText) {
    const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
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
let valid
function validatePhoneNumber() {

    // Récupérer le numéro complet et la validité
    const phoneNumber = phoneInputField = document.getElementById('email').value;

    const isValid = itiInstance.isValidNumber();
    selectedCountryData = itiInstance.getSelectedCountryData();

    console.log("Numéro complet :", phoneNumber || "Vide");
    console.log("Est valide :", isValid);
    console.log("Pays sélectionné :", JSON.stringify(selectedCountryData));

    selectedCountryData = addValidLengthToCountry(selectedCountryData);
    // Vérifier si la longueur du numéro est correcte après l'indicatif pays
    const phoneWithoutCode = phoneNumber.replace(`+${selectedCountryData.dialCode}`, '').replace(' ', '').trim();

    if (phoneWithoutCode.length === selectedCountryData.validLength) {
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
const contactField = document.getElementById('email');
const contactFieldPwd = document.getElementById('password');

let itiInstance;
contactFieldPwd.addEventListener('input', () => {
    var button = document.getElementById('login');

    // Disable the button
    button.disabled = false;
})
contactField.addEventListener('input', () => {
    var button = document.getElementById('login');

    // Disable the button
    button.disabled = false;
    const value = contactField.value.trim();
    console.log("value: ", value)
    // Vérifie si l'entrée ressemble à un numéro de téléphone (+ ou chiffres uniquement)
    console.log("/^[+0-9]/.test(value)&& contactField.type === 'email': ", contactField.type === 'email')
    if (/^[+0-9]/.test(value) && contactField.type === 'email') {
        console.log("/^[+0-9]/.test(value) && contactField.type === 'email'")
        // Convertir le champ en input type="tel"
        contactField.type = 'tel';

        // Initialiser l'instance intl-tel-input
        itiInstance = intlTelInput(contactField, {
            initialCountry: 'tn',
            geoIpLookup: (callback) => {
                fetch("https://ipinfo.io")
                    .then((response) => response.json())
                    .then((data) => callback(data.country))
                    .catch(() => callback('tn'));
            },
            utilsScript: "./utils.js", // Remplacez `path/to/` par le chemin correct vers votre fichier utils.js
            loadUtilsOnInit: true, // Nouvelle méthode pour charger les utilitaires

        });
        contactField.value = "+216";
        // Mettre à jour la valeur du champ quand le pays change
        contactField.addEventListener("countrychange", function () {
            const dialCode = itiInstance.getSelectedCountryData().dialCode;
            contactField.value = `+${dialCode} `;
        });

    }
    if (contactField.value.trim() === '' && itiInstance) {
        contactField.type = 'email';

        itiInstance.destroy(); // Supprime l'instance ITI
        itiInstance = null;
    }

});

// Optionnel : Réinitialiser le champ si l'utilisateur supprime tout
contactField.addEventListener('blur', () => {
    console.log("contactField.value.trim() === '': ", contactField.value.trim() === '')

});
// Ensure you include this script at the bottom of your HTML file
document.getElementById('loginForm').addEventListener('submit', async function (event) {
    // Get the button element
    var button = document.getElementById('login');

    // Disable the button
    button.disabled = true;
    event.preventDefault(); // Prevent the default form submission

    // Gather form data
    const email = this.email.value;

    const password = this.password.value;
    const contactField = document.getElementById('email');
    const value = contactField.value.trim();
    console.log("email: ", email, "password : ", password)
    // Vérifie si l'entrée ressemble à un numéro de téléphone (+ ou chiffres uniquement)
    console.log("/^[+0-9]/.test(value) && contactField.type === 'email': ", contactField.type === 'email')
    let objauth
    if (/^[+0-9]/.test(value)) {
        objauth = Object.assign({ password: password }, { phone_number: email })
        validatePhoneNumber()
    }
    else {
        objauth = Object.assign({ password: password }, { email: email })

    }

    console.log("objauth: ", objauth)
    // Validate form data
    if (!email || !password) {
        alert('Tous les champs sont requis.');
        return;
    }

    try {
        // Send POST request to the API
        const response = await fetch('https://fr.wiccrm.com:3004/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(objauth),
        });

        const data = await response.json();

        if (response.ok) {

            console.log("data:", data)
            // Store the token in local storage or session storage
            const encryptedData = encryptData(data);
            console.log("Login : ", encryptedData);
            sessionStorage.setItem('auth', encryptedData);
            if (sessionStorage.getItem('rendezvous')) {
                console.log("**************************************Rendez-vous Medecin")

                console.log("sessionStorage.getItem('rendezvous'): ", sessionStorage.getItem('rendezvous'))
                const RendezVous = decryptData(sessionStorage.getItem("rendezvous"));
                console.log("RendezVous: ", JSON.stringify(RendezVous),data.token)

                const requestOptions = {
                    method: 'POST', // ou 'GET', 'PUT', 'DELETE' selon votre besoin
                    headers: {
                        'Authorization': `Bearer ${data.token}`, // Ajouter le token dans l'en-tête Authorization
                        'Content-Type': 'application/json' // Type de contenu si vous envoyez des données
                    },
                    body: JSON.stringify(RendezVous) // Convertir l'objet en chaîne JSON
                };
                if (sessionStorage.getItem("rdv")) {
                    if (sessionStorage.getItem("rdv") == 0) {
                        // Appeler l'API
                        fetch("https://fr.wiccrm.com:3004/ajouterrendezvous", requestOptions)
                            .then(response => {

                                if (!response.ok) {
                                    throw new Error('Erreur lors de l\'envoi des données');
                                }
                                return response.json(); // Analyser la réponse JSON
                            })
                            .then(data => {
                                var button = document.getElementById('login');

                                // Disable the button
                                button.disabled = false;
                                console.log('Réponse de l\'API :', data);

                                if (data.message == "Rendez-vous inséré avec succès") {
                                    alert("🎉 Votre rendez-vous a été confirmé !\n\nVeuillez consulter votre email / Téléphone pour plus de détails.\n\nMerci de votre confiance !");
                                    sessionStorage.removeItem("rendezvous")
                                    window.location.href = 'https://fr.wiccrm.com/profil.html'; // Rediriger vers la page 2

                                }
                            })
                            .catch(error => {
                                //var button = document.getElementById('login');
                                // Disable the button
                                //button.disabled = false;
                                console.error('Erreur :', error);
                                alert("Une erreur est survenue lors de la prise de rendez-vous. Veuillez réessayer plus tard.")
                                sessionStorage.removeItem("rendezvous")
                                window.location.href = 'https://fr.wiccrm.com/profil.html'; // Rediriger vers la page 2
                            });
                    }
                    else {
                        // Appeler l'API
                        fetch("https://fr.wiccrm.com:3004/ajouterrendezvoustele", requestOptions)
                            .then(response => {

                                if (!response.ok) {
                                    throw new Error('Erreur lors de l\'envoi des données');
                                }
                                return response.json(); // Analyser la réponse JSON
                            })
                            .then(data => {
                                console.log('Réponse de l\'API :', data);

                                if (data.message == "Rendez-vous inséré avec succès") {
                                    alert("🎉 Votre demande de téléconsultation a été envoyée !\n\nVeuillez consulter votre email / Téléphone pour plus de détails.\n\nMerci de votre confiance !");
                                    sessionStorage.removeItem("rendezvousClinic")
                                    window.location.href = 'https://fr.wiccrm.com/profil.html'; // Rediriger vers la page 2

                                }

                            })
                            .catch(error => {
                                console.error('Erreur :', error);
                            });
                    }
                    //window.location.href = 'https://fr.wiccrm.com/profil.html'; // Rediriger vers la page 2
                }
            }
            else if (sessionStorage.getItem('rendezvousClinic')) {
                console.log("**************************************Rendez-vous Clinique")
                console.log("sessionStorage.getItem('rendezvousClinic'): ", sessionStorage.getItem('rendezvousClinic'))
                const rendezvousClinic = decryptData(sessionStorage.getItem("rendezvousClinic"));
                console.log("rendezvousClinic: ", JSON.stringify(rendezvousClinic))
                const requestOptions = {
                    method: 'POST', // ou 'GET', 'PUT', 'DELETE' selon votre besoin
                    headers: {
                        'Authorization': `Bearer ${data.token}`, // Ajouter le token dans l'en-tête Authorization
                        'Content-Type': 'application/json' // Type de contenu si vous envoyez des données
                    },
                    body: JSON.stringify(rendezvousClinic) // Convertir l'objet en chaîne JSON
                };
                // Appeler l'API
                fetch("https://fr.wiccrm.com:3004/ajouterrendezvousclinic", requestOptions)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Erreur lors de l\'envoi des données');
                        }
                        return response.json(); // Analyser la réponse JSON
                    })
                    .then(data => {
                        console.log('Réponse de l\'API :', data);
                        if (data.message == "Rendez-vous inséré avec succès") {
                            alert("🎉 Votre rendez-vous a été confirmé !\n\nVeuillez consulter votre email / Téléphone pour plus de détails.\n\nMerci de votre confiance !");
                            sessionStorage.removeItem("rendezvousClinic")
                            window.location.href = 'https://fr.wiccrm.com/profil.html'; // Rediriger vers la page 2

                        }
                    })
                    .catch(error => {
                        console.error('Erreur :', error);
                    });


            }
            else {
                var button = document.getElementById('login');

                // Disable the button
                button.disabled = false;
                alert('Connexion réussie!');
                window.location.href = 'https://fr.wiccrm.com/profil.html'; // Rediriger vers la page 2
            }

        } else {
            var button = document.getElementById('login');

            // Disable the button
            button.disabled = false;
            alert(data.error || 'Une erreur est survenue. Veuillez réessayer.');
        }
    } catch (error) {
        var button = document.getElementById('login');

        // Disable the button
        button.disabled = false;
        console.error('Erreur lors de la connexion:', error);
        alert('Une erreur est survenue. Veuillez réessayer.');
    }
});

// Function to clear the session storage item
function clearSessionStorageItem() {
    sessionStorage.removeItem('rendezvous');
    console.log('Session storage item cleared after 15 minutes.');
}

// Set a timeout to clear the session storage item after 15 minutes (900000 milliseconds)
//setTimeout(clearSessionStorageItem, 900000);
