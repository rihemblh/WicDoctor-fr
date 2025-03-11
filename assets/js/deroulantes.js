const annuaireList = document.getElementById('annuaire-list');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

let currentPage = 1;
//rihem 25/11/2025
const limit = 10; // Nombre de résultats par page

// Fonction pour charger une page
async function loadPage(page) {
    const offset = (page - 1) * limit;

    try {                            
        const response = await fetch(`https://wic-doctor.com:3004/getannuaire?limit=${limit}&offset=${offset}`);
        const data = await response.json();

        // Afficher les résultats
        renderResults(data);

        // Activer/désactiver les boutons de pagination
        prevBtn.disabled = page === 1;
        nextBtn.disabled = data.length < limit; // Désactiver si moins de résultats que `limit`
    } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
    }
}

// Fonction pour afficher les résultats
function renderResults(data) {
    annuaireList.innerHTML = ''; // Réinitialiser la liste

    data.forEach(item => {
        const div = document.createElement('div');
        div.className = 'annuaire-item';

        // Gestion du nom
        let name;
        try {
            const parsedName = JSON.parse(item.name);
            name = parsedName.fr || 'Nom non disponible';
        } catch (e) {
            name = item.name || 'Nom non disponible';
        }

        // Gestion des spécialités
        let specialities = item.specialities || 'Non spécifié';


        // Gestion du pays
        let pays;
        try {
            const parsedPays = JSON.parse(item.pays);
            pays = parsedPays.fr || 'Non spécifié';
        } catch (e) {
            pays = item.pays || 'Non spécifié';
        }

        // Gestion de la ville
        let ville;
        try {
            const parsedVille = JSON.parse(item.ville);
            ville = parsedVille.fr || 'Non spécifié';
        } catch (e) {
            ville = item.ville || 'Non spécifié';
        }

        div.innerHTML = `
           <div class="scrollable-container" style="max-height:350px; overflow-y: auto; padding:10px; height:100%">
                <div class="card" style="border: none;">
                    <div class="d-md-flex">
                        <!-- Image du médecin -->
                        <div class="item-card9-img" style="width: 122px;height: 106px;border-radius: 50%;object-fit: cover;">
                            <div class="item-card9-imgs">
                                <img alt="img" class="cover-image" src="assets/images/media/doctors/${item.photo || 'doctor.png'}">
                            </div>
                        </div>

                        <!-- Informations du médecin -->
                        <div class="card border-0 mb-0" style="flex: 1;">
                            <div class="card-body">
                                <div class="item-card9">
                                    <h4 class="font-weight-bold mt-1 mb-1">${name}</h4>
                                    
                                    <div class="mt-2 mb-0">
                                        <ul class="item-card-features mb-0">
                                            <li><span><i class="fa fa-map-marker me-1 text-muted"></i>${ville}, ${pays}</span></li>
                                            <li><span><i class="fe fe-briefcase me-1 text-muted d-inline-block"></i>${specialities}</span></li>
                                            <li><span><i class="fa fa-phone me-1 text-muted"></i>${item.phone_number || 'Non disponible'}</span></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        annuaireList.appendChild(div);
    });
}

// Gestion des clics sur les boutons de pagination
prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        loadPage(currentPage);
    }
});

nextBtn.addEventListener('click', () => {
    currentPage++;
    loadPage(currentPage);
});

// Charger la première page au chargement
loadPage(currentPage);