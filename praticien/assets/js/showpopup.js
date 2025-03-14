// Fonction pour afficher la popup
function showPopup() {
    const modal = document.getElementById('popupModal');
    modal.style.display = 'block'; // Afficher la popup
}

// Fonction pour fermer la popup
function closePopup() {
    const modal = document.getElementById('popupModal');
    modal.style.display = 'none'; // Masquer la popup
}

// Optionnel : Fermer la popup si l'utilisateur clique en dehors de la popup
window.onclick = function(event) {
    const modal = document.getElementById('popupModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}