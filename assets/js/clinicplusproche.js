navigator.geolocation.getCurrentPosition(
    (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        console.log("latitude**: ",latitude)
        console.log("longitude**: ",longitude)

        // Définir la position de l'utilisateur
        const userPosition = { lat: latitude, lng: longitude };
        console.log("userPosition: ",userPosition)
        console.log("latitude**: ", latitude);
        console.log("longitude**: ", longitude);

        // Ajouter un marqueur bleu pour la position de l'utilisateur
        const userMarker = new google.maps.Marker({
            position: userPosition,
            map: map,  // Assurez-vous que la carte est initialisée
            title: "Votre position",
            icon: {
                url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
            }
        });

        // Centrer la carte sur la position de l'utilisateur
        map.setCenter(userPosition);

        // Appel à l'API pour récupérer les médecins proches
        fetch(`https://wic-doctor.com:3004/api/clinicsparposition?latitude=${latitude}&longitude=${longitude}`)
            .then(response => response.json())
            .then(data => {
                console.log("localisation clinique: ",data)
                displayDoctors(data); // Afficher les médecins récupérés
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des clinique pos :', error);
            });
    },
    (error) => {
        console.error('Erreur lors de l\'obtention de la localisation :', error);
    }
);

// Fonction pour afficher les médecins sur la carte uniquement
function displayDoctors(doctors) {
    doctors.forEach(doctor => {
        // Log the entire doctor object for debugging
        console.log("cllinic pos data:", doctor);

        // Default name and description if parsing fails
        let doctorName = "Nom indisponible"; 
        let specialties = doctor.specialty_names || "Aucune spécialité disponible"; // Fallback to default if specialties are missing

        // Check if doctor.description exists and is valid JSON
     

        // Add a marker for each doctor on the map
        const doctorPosition = { lat: doctor.latitude, lng: doctor.longitude };
        const marker = new google.maps.Marker({
            position: doctorPosition,
            map: map,
            title: doctorName,
            icon: {
                url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
            }
        });

        // Create an InfoWindow for the marker, now including name, specialties, and distance
        const infowindow = new google.maps.InfoWindow({
            content: `
                <div>
                    <h3>${doctorName}</h3>
                    <p><strong>Spécialité(s):</strong> ${specialties}</p>
                    <p>Distance: ${doctor.distance ? doctor.distance.toFixed(2) : 'N/A'} km</p>
                </div>
            `
        });

        // Add click event to open the InfoWindow when the marker is clicked
        marker.addListener('click', () => {
            infowindow.open(map, marker);
        });
    });
}
