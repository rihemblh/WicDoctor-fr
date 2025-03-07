// Clé de chiffrement (doit être sécurisée)
const secretKey = "maCleSecrete";
// Fonction pour crypter
function encryptData(data) {
    return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
}

// Fonction pour décrypter
function decryptData(cipherText) {
    const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}
console.log('data:', sessionStorage.getItem('dataClinique')); // Accéder à la valeur du cookie
ListCliniques = decryptData(sessionStorage.getItem('dataClinique'));
console.log("**************************ListCliniques: ", ListCliniques)
displayClinicsInCards(ListCliniques)
function displayClinicsInCards(clinics) {
    const container = document.getElementById('clinic');
    container.innerHTML = ''; // Vider les résultats précédents

    console.log('clinics to display:', clinics); // Afficher les données des médecins dans la console

    if (!clinics || clinics.length === 0) {
        container.innerHTML = '<p>Aucun clinique trouvé.</p>';
    } else {
        clinics.forEach(item => {
            const encryptedData = encryptData(item);
            console.log("Données chiffrées : ", encryptedData);
            console.log("item clinic: ", item, JSON.parse(item.clinic_name))
            // Vérification si "name", "ville", et "specialities" sont des objets ou des chaînes JSON
            const name = typeof item.clinic_name === 'string' ? JSON.parse(item.clinic_name).fr : item.clinic_name?.fr || "Nom inconnu";
            const ville = typeof item.addresses[0].ville === 'string' ? JSON.parse(item.addresses[0].ville).fr : item.addresses[0].ville?.fr || "Ville inconnue";

            const title = item.addresses[0].address || "Titre non fourni";
            const horaires = item.horaires || "Horaires non fournis";
            const photos = item.clinic_photos || "clinic.jpg";

            const cardHTML = `
            <div class="scrollable-container" style="max-height:350px; overflow-y: auto; padding:10px; height:100%">
            <div class="card-container" style="display:flex; flex-direction:column;">
                <div class="card overflow-hidden">
                    <div class="d-md-flex">
                        <div class="item-card9-img" style="width: 122px;height: 106px;border-radius: 50%;object-fit: cover;">
                            <div class="item-card9-imgs">			
                                <img alt="img" class="cover-image"
                                    src="assets/images/media/cliniques/${photos}">
                                <a href="#" onclick="GetDetailsClinic('${encryptedData}')"></a>
                            </div>
                        </div>
                        <div class="card border-0 mb-0">
                            <div class="card-body">
                                <div class="item-card9">    
                                    <a href="#" onclick="GetDetailsClinic('${encryptedData}')" class="text-dark">
                                        <h4 class="font-weight-bold mt-1 mb-1">${name}</h4>
                                    </a>
                                    <div class="mt-2 mb-0">
                                        <ul class="item-card-features mb-0">
                                            <li><span><i class="fa fa-map-marker me-1 text-muted"></i>${ville}</span></li>
                                            <li class="mb-0"><span><i class="fa fa-user-md me-1 text-muted"></i> ${title} d'expérience</span></li>
                                            <li><span><i class="fa fa-clock-o me-1"> ${horaires}</i></span></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer p-0">
                        <div class="item-card9-footer btn-appointment">
                            <div class="btn-group w-100">
                                <a href="#" onclick="GetDetailsClinic('${encryptedData}')" class="btn btn-outline-light w-50 p-2 border-top-0 border-end-0 border-bottom-0">
                                    <i class="fe fe-eye me-1"></i><span class=" d-none d-sm-inline-block">Détails</span></a>
                                <a href="#" onclick="GetDetailsClinic('${encryptedData}')" class="btn btn-outline-light w-50 p-2 border-top-0 border-end-0 border-bottom-0 call-btn">
                                    <div class="call-btn-1">
                                        <i class="fe fe-phone me-1"></i><span class=" d-none d-sm-inline-block">Rendez-vous</span>
                                    </div>
                                  
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
            container.innerHTML += cardHTML;
        });
    }
}
function GetDetailsClinic(clinic) {
    sessionStorage.setItem("dataC", clinic)
    window.location.href = 'userprofile2.html'; // Rediriger vers la page 2
}
