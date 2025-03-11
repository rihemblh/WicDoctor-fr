const apiUrl = 'https://fr.wiccrm.com:3004/affalldoctors-france';

// Fonction pour récupérer la liste des médecins
async function fetchDoctorsList() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Erreur de réseau lors de la récupération des données');
        }
        const data = await response.json();
        return data; // Retourne les données pour les utiliser dans d'autres fonctions
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        return []; // Retourner un tableau vide en cas d'erreur
    }
}

// Fonction pour afficher les médecins dans la liste
function displayDoctors(doctors) {
    const doctorList = document.getElementById('doctorList');
    doctorList.innerHTML = ''; // Vider la liste actuelle

    if (doctors.length === 0) {
        doctorList.innerHTML = '<p>Aucun médecin trouvé.</p>'; // Afficher un message si aucun médecin n'est trouvé
        return;
    }

    doctors.forEach(item => {
        doctorList.innerHTML += `
        <div class="card overflow-hidden">
            <div class="d-md-flex">
                <div class="item-card9-img" style="width: 122px;height: 162px;border-radius: 50%;object-fit: cover;">
                    <div class="item-card9-imgs">
                        <a href="hospital-details.html"></a>
                    </div>
                </div>
                <div class="card border-0 mb-0">
                    <div class="card-body">
                        <div class="item-card9">    
                            <a href="hospital-details.html" class="text-dark">
                                <h4 class="font-weight-bold mt-1 mb-1">${JSON.parse(item.name).fr || "Nom inconnu"}</h4>
                            </a>
                            <div class="mt-2 mb-0">
                                <ul class="item-card-features mb-0">
                                    <li><span><i class="fa fa-map-marker me-1 text-muted"></i>${JSON.parse(item.ville).fr || "Ville inconnue"}</span></li>
                                    <li><span><i class="fe fe-briefcase me-1 text-muted d-inline-block"></i>${JSON.parse(item.specialities).fr || "Spécialité inconnue"}</span></li>
                                    <li class="mb-0"><span><i class="fa fa-user-md me-1 text-muted"></i>${item.title || "Titre non fourni"}</span></li>
                                    <li><span><i class="fa fa-clock-o me-1">${item.horaires || "Horaires non fournis"}</i></span></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-footer p-0">
                <div class="item-card9-footer btn-appointment">
                    <div class="btn-group w-100">
                        <a href="javascript:void(0);" class="btn btn-outline-light w-50 p-2 border-top-0 border-end-0 border-bottom-0"><i class="fe fe-eye me-1"></i><span class="d-none d-sm-inline-block">Profile</span></a>
                        <a class="btn btn-outline-light w-50 p-2 border-top-0 border-end-0 border-bottom-0 call-btn">
                            <div class="call-btn-1">
                                <i class="fe fe-phone me-1"></i><span class="d-none d-sm-inline-block">Call</span>
                            </div>
                            <div class="call-number">
                                +65 847596 82
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
        `;
    });
}

// Fonction pour filtrer les médecins par spécialité sélectionnée
async function filterDoctorsBySpeciality() {
    const selectedSpeciality = document.getElementById('Spécialité').value;
    const doctors = await fetchDoctorsList();

    let filteredDoctors = doctors;

    // Vérifie si une spécialité est sélectionnée
    if (selectedSpeciality) {
        // Filtrer les médecins selon la spécialité sélectionnée
        filteredDoctors = doctors.filter(item => {
            const speciality = JSON.parse(item.specialities).fr;
            return speciality === selectedSpeciality; // Vérifie si la spécialité correspond à celle sélectionnée
        });
    }

    // Afficher les médecins filtrés
    displayDoctors(filteredDoctors);
}

// Écouteur d'événements pour le changement de spécialité
$(document).ready(function() {
    fetchDoctorsList().then(displayDoctors); // Récupérer et afficher la liste des médecins au chargement

    // Écouter le changement sur le sélecteur de spécialité
    $('#Spécialité').change(function() {
        filterDoctorsBySpeciality(); // Appeler la fonction de filtrage
    });
});
