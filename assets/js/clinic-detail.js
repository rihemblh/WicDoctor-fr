// Clé de chiffrement (doit être sécurisée)
const secretKey = "maCleSecrete";
var appointment = {}
// Fonction pour crypter
function encryptData(data) {
	return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
}

// Fonction pour décrypter
function decryptData(cipherText) {
	const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
	return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}

specialities
console.log("sessionStorage.getItem('dataC'): ", decryptData(sessionStorage.getItem('dataC')))
Detailsclinic = decryptData(sessionStorage.getItem('dataC'));
console.log("Detailsclinic: ", Detailsclinic)
appointment = Object.assign(appointment, { clinic_id: Detailsclinic.clinic_id })
document.getElementById('titre').textContent = JSON.parse(Detailsclinic.clinic_name).fr
apiurl = `https://wic-doctor.com:3004/getspecialitiesparclinics/19}`
console.log(`https://wic-doctor.com:3004/getspecialitiesparclinics/${Detailsclinic.clinic_id}`)
// Fetch the data using the constructed URL
fetch(apiurl)
	.then(response => {
		if (!response.ok) {
			throw new Error('Erreur lors de la récupération des données des spacialities clinic');
		}
		return response.json();
	})
	.then(data => {
		console.log('spacialities clinic:', data);
		displayClinicsSpecialities(data);

	})
	.catch(error => {
		console.error('Erreur:', error);
		alert("Pas de spécialité pour ce clinic")
	});
// Split the string by ', ' to get each object separately
console.log("Detailsclinic.description: ", Detailsclinic.description)
//Detailsclinic.description = Detailsclinic.description.split(', ');
Detailsclinic.phone_numbers = Detailsclinic.phone_numbers.split(', ');
Detailsclinic.mobile_numbers = Detailsclinic.mobile_numbers.split(', ');
Detailsclinic.level_names = Detailsclinic.level_names.split(', ');
console.log("Detailsclinic after: ", JSON.stringify(Detailsclinic), Detailsclinic)
donnemap = { lat: Detailsclinic.addresses[0].latitude, lng: Detailsclinic.addresses[0].longitude }
console.log("Detailsclinic.description[0]: ", Detailsclinic,JSON.parse(Detailsclinic.clinic_name).fr, donnemap)
selectClinic(JSON.parse(Detailsclinic.clinic_name).fr, donnemap, JSON.parse(Detailsclinic.description).fr, Detailsclinic.horaires)

let currentStep = 1;

for (let i = 0; i < Detailsclinic.addresses.length; i++) {
	console.log("Detailsclinic.description[i]: ", Detailsclinic.description)
	const descclinic = JSON.parse(Detailsclinic.description).fr || "description non fournis";
	console.log("descclinic: ", descclinic)
	document.getElementById('list-address').innerHTML = document.getElementById('list-address').innerHTML + `
	<div class="card clinic-card mb-3  bg-white" onclick="selectClinic('${JSON.parse(Detailsclinic.clinic_name).fr}', {lat: ${Detailsclinic.addresses[i].latitude}
	, lng: ${Detailsclinic.addresses[i].longitude}}, '${descclinic}', '${Detailsclinic.horaires}')">
							<div class="card-body">
								<h5 class="card-title">${JSON.parse(Detailsclinic.addresses[i].description).fr}</h5>
								<p class="card-text">Adresse : ${Detailsclinic.addresses[i].address}</p>
							</div>
						</div>
	`
}






function initMap(clinicPosition) {
	let map;


	const mapOptions = {
		center: clinicPosition, // Position initiale de la carte
		zoom: 15,               // Niveau de zoom
	};
	map = new google.maps.Map(document.getElementById("map"), mapOptions); // Assurez-vous que l'élément #map existe dans votre HTML

	const marker = new google.maps.Marker({
		position: clinicPosition,
		map: map,
		icon: {
			url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
		}
	});
}


// Fonction pour sélectionner une clinique et afficher ses détails
function selectClinic(name, coords, description, hours) {
	document.getElementById("descriptionText").innerText = description;
	document.getElementById("hoursText").innerText = hours;
	const clinicPosition = { lat: coords.lat, lng: coords.lng };
	$(document).ready(function () {
		initMap(clinicPosition)

	});


	//document.getElementById("clinicMap").innerHTML = `<p>Carte pour ${name} à (${coords.lat}, ${coords.lng})</p>`;
	//nextStep(2);
}

// Fonction pour passer à l'étape suivante
function nextStep(step) {
	if (currentStep < step) {
	if (!validateStep(currentStep)) return; // Validation de l'étape actuelle
	}
	// Cacher l'étape actuelle
	document.getElementById(`step${currentStep}`).style.display = 'none';

	// Afficher la prochaine étape
	document.getElementById(`step${step}`).style.display = 'block';
	currentStep = step;

	// Mise à jour de l'indicateur des étapes
	for (let i = 1; i <= 5; i++) {
		document.getElementById(`step${i}Indicator`).classList.remove('active', 'validated');
		if (i < step) {
			document.getElementById(`step${i}Indicator`).classList.add('validated');
		} else if (i === step) {
			document.getElementById(`step${i}Indicator`).classList.add('active');
		}
	}
	document.getElementById('prevButton').style.display =  'inline-block';

	// Désactiver le bouton suivant sur la dernière étape
	document.getElementById('nextButton').style.display = (step === 5) ? 'none' : 'inline-block';
	document.getElementById('confirmButton').style.display = (step === 5) ? '' : 'none';

	


}

// Fonction pour revenir à l'étape précédente
function prevStep() {
	if (currentStep > 1) {
		nextStep(currentStep - 1);
	}

}

// Fonction pour valider les sélections dans les étapes
function validateStep(step) {
	if (step === 2) {
		const selectedSpeciality = document.querySelector('input[name="specialite"]:checked');
		if (!selectedSpeciality) {
			alert("Veuillez sélectionner une spécialité.");
			return false;
		}
	}
	if (step === 3) {
		const selectedReason = document.querySelector('input[name="reason"]:checked');
		if (!selectedReason) {
			alert("Veuillez sélectionner un motif.");
			return false;
		}
	}
	return true;
}








function displayClinicsSpecialities(data) {
	for (let i = 0; i < data.length; i++) {
		document.getElementById('specialities').innerHTML = document.getElementById('specialities').innerHTML +
			`
          <input type="radio" id="specialite${i}" value="${data[i].specialty_id}" name="specialite" onclick="getSelectedSpeciality()">
					<label for="specialite${i}">${JSON.parse(data[i].specialty_name).fr}</label>
		`

	}
	data.forEach((spec, index) => {
		console.log("************************************spec",spec)
		spec.doctors_name = spec.doctors_name.split(', ');
		if(spec.doctor_photos !=null)
		{spec.doctor_photos = spec.doctor_photos.split(', ') ;}
		else
		spec.doctor_photos =[]
		console.log("data after: ", data)
		document.getElementById('equipe').innerHTML = document.getElementById('equipe').innerHTML +
			`
	<div class="row " id="equipe">
	<p class="spec-clinic">${JSON.parse(spec.specialty_name).fr}</p>
	<hr>`
		spec.doctors_name.forEach((doctor, index) => {
			const photos = spec.doctor_photos[index] || "doctor.png";
			document.getElementById('equipe').innerHTML = document.getElementById('equipe').innerHTML +
				`

	<div class="col-md-4">
						<div class="doctor-card">
							<img src="assets/images/media/doctors/${photos}" alt="Médecin 1">
							<div class="doctor-info">
								<strong>Dr. ${JSON.parse(doctor).fr}</strong>
								<br>
								<span>${JSON.parse(spec.specialty_name).fr}</span>
							</div>
						</div>
					</div>
					
	`


		})
		document.getElementById('equipe').innerHTML = document.getElementById('equipe').innerHTML +
			`</div>`
	})
}
var Speciality
function getSelectedSpeciality() {
	const selectedSpeciality = document.querySelector('input[name="specialite"]:checked');

	if (selectedSpeciality) {
		console.log("Selected speciality:", selectedSpeciality.value, selectedSpeciality); // Log the selected value
		Speciality = selectedSpeciality.value
		console.log(`https://wic-doctor.com:3004/patternsclinic/${Detailsclinic.clinic_id}/${selectedSpeciality.value}`)
		fetch(`https://wic-doctor.com:3004/patternsclinic/${Detailsclinic.clinic_id}/${selectedSpeciality.value}`)
			.then(response => {
				if (!response.ok) {
					throw new Error('Erreur lors de la récupération des données des Pattern clinic');
				}
				return response.json();
			})
			.then(data => {
				console.log('Pattern clinic:', data);
				displayClinicsMotif(data);
				nextStep(3)

			})
			.catch(error => {
				console.error('Erreur:', error);
				alert("Pas de motif pour cette specialité")

			});
		// You can use selectedSpeciality.value for further processing
	} else {
		console.log("No speciality selected");
	}
}
function displayClinicsMotif(data) {
	for (let i = 0; i < data.length; i++) {
		document.getElementById('motif').innerHTML = document.getElementById('motif').innerHTML +
			`
		<input type="radio" id="reason${i}" name="reason" value="${data[i].id}" onclick="getSelectedPatern()">
					<label for="reason${i}">${JSON.parse(data[i].nom).fr}</label>
		`
	}
}

function getSelectedPatern() {
	const selectedPatern = document.querySelector('input[name="reason"]:checked');

	if (selectedPatern) {
		appointment = Object.assign(appointment, { motif_id: selectedPatern.value })
		console.log("Selected Pattern:", selectedPatern.value, selectedPatern, `https://wic-doctor.com:3004/doctorsspeciality/${Speciality}/${Detailsclinic.clinic_id}/${selectedPatern.value}`); // Log the selected value
		fetch(`https://wic-doctor.com:3004/doctorsspeciality/${Speciality}/${Detailsclinic.clinic_id}/${selectedPatern.value}`)
			.then(response => {
				if (!response.ok) {
					throw new Error('Erreur lors de la récupération des données des doctor clinic');
				}
				return response.json();
			})
			.then(data => {
				console.log('doctor clinic:', data);
				Doctordispo = data
				if (Doctordispo.length > 0)
					nextStep(4)
				else
					nextStep(5)
				displayDoctors(data);

			})
			.catch(error => {
				console.error('Erreur:', error);
				const container = document.getElementById('clinic');
				container.innerHTML = '<center><h2> Pas de doctor clinic trouvé</h2></center>';
			});
		// You can use selectedSpeciality.value for further processing
	} else {
		console.log("No patern selected");
	}
}
// New function to display doctors
function displayDoctors(data) {
	const doctorList = document.getElementById('doctorList');
	doctorList.innerHTML = ''; // Clear any existing doctors

	data.forEach((doctor, index) => {
		const photos = doctor.doctor_photo|| "doctor.png";

		const doctorCard = `
<div class="col-md-4">
                <div class="doctor-card" id="doctorCard${index}" onclick="selectDoctor(${index})">
                    <img src="assets/images/media/doctors/${photos}" alt="${doctor.doctor_name}" class="doctor-photo">
                    <div class="doctor-info">
                        <strong>${JSON.parse(doctor.doctor_name).fr}</strong>
                    </div>
                </div>
            </div>`;
		doctorList.innerHTML += doctorCard;
	});
}
var availability
// Function to handle doctor selection
function selectDoctor(index) {
	// Remove the 'selected' class from all doctor cards
	const doctorCards = document.querySelectorAll('.doctor-card');
	doctorCards.forEach(card => card.classList.remove('selected'));

	// Add the 'selected' class to the clicked doctor card
	const selectedCard = document.getElementById(`doctorCard${index}`);
	selectedCard.classList.add('selected');

	// Store the selected doctor data
	selectedDoctor = Doctordispo[index];
	appointment = Object.assign(appointment, { doctor_id: selectedDoctor.doctor_id })
	console.log(`https://wic-doctor.com:3004/availability/${Detailsclinic.clinic_id}/${selectedDoctor.doctor_id}`)
	fetch(`https://wic-doctor.com:3004/availability/${Detailsclinic.clinic_id}/${selectedDoctor.doctor_id}`)
		.then(response => {
			if (!response.ok) {
				throw new Error('Erreur lors de la récupération des données des availability clinic');
			}
			return response.json();
		})
		.then(data => {
			console.log('availability clinic:', JSON.stringify(data));
			availability = data
			console.log("availabity slots: ", availability)
			// Appeler la fonction pour remplir les créneaux disponibles
			//displayAvailableSlots();
			initializeWeek(); // Initialize the week view on page load
			nextStep(5)
			//displayDoctors(data);

		})
		.catch(error => {
			console.error('Erreur:', error);
			availability = []
			initializeWeek(); // Initialize the week view on page load
			nextStep(5)

			//const container = document.getElementById('clinic');
			//container.innerHTML = '<center><h2> Pas de doctor clinic trouvé</h2></center>';
		});

	// Hide error message if a doctor is selected
	//document.getElementById('doctorError').style.display = 'none';
	console.log(`Doctor selected: ${selectedDoctor.doctor_name}`);
}


/*   // JSON data representing available time slots
  const availability = [
	{"start_at":"2024-10-24T09:36:06.000Z","end_at":"2024-10-24T10:36:06.000Z"},
	{"start_at":"2024-10-24T14:41:38.000Z","end_at":"2024-10-24T15:41:38.000Z"},
	{"start_at":"2024-10-26T08:36:44.000Z","end_at":"2024-10-26T09:36:44.000Z"}
]; */

let currentWeekStart = new Date();
currentWeekStart.setHours(0, 0, 0, 0);
let selectedSlot = '';

// Initialize the week view
function initializeWeek() {
	console.log("********************************************************initialize")
	updateWeek();
}

// Update the week view with days and time slots
function updateWeek() {
	const daysHeader = document.getElementById('days-header');
	const timeSlotsContainer = document.getElementById('time-slots-container');
	daysHeader.innerHTML = '';
	timeSlotsContainer.innerHTML = '';

	const days = [];
	for (let i = 0; i < 7; i++) {
		const date = new Date(currentWeekStart);
		date.setDate(currentWeekStart.getDate() + i);
		const dayName = date.toLocaleDateString('fr-FR', { weekday: 'long' }).toUpperCase();
		const dayDate = date.getDate();
		const month = date.toLocaleDateString('fr-FR', { month: 'long' }).toUpperCase();

		days.push({ date, dayName });

		const th = document.createElement('th');
		th.classList.add('day-header');
		th.innerHTML = `${dayName}<br><span class="date-month">${dayDate} ${month}</span>`;
		daysHeader.appendChild(th);
	}

	// Define how many lines (time slots) to display for each day
	const numTimeSlots = 6;

	// Create time slots for each day
	for (let i = 0; i < numTimeSlots; i++) {
		const tr = document.createElement('tr');

		days.forEach(day => {
			const td = document.createElement('td');
			td.classList.add('time-slot');

			// Filter available slots for the current day
			const daySlots = availability.filter(slot => {
				const slotDate = new Date(slot.start_at);
				return slotDate.toDateString() === day.date.toDateString();
			});

			// Check if we have available slots
			if (daySlots.length > 0 && daySlots[i]) {
				const slot = daySlots[i];
				console.log("slot: ", slot);

				// Function to format time from UTC
				function formatUTCDate(dateString) {
					const date = new Date(dateString);
					const hours = date.getUTCHours().toString().padStart(2, '0'); // Get hours in UTC
					const minutes = date.getUTCMinutes().toString().padStart(2, '0'); // Get minutes in UTC
					return `${hours}:${minutes}`; // Return formatted time as HH:mm
				}

				// Format start and end time using the utility function
						// Format start and end time using the utility function
						const startTime = new Date(slot.start_at).toLocaleTimeString('fr-FR', {
							hour: '2-digit',
							minute: '2-digit'
						});
						const endTime = new Date(slot.end_at).toLocaleTimeString('fr-FR', {
							hour: '2-digit',
							minute: '2-digit'
						});;

				// Log formatted times
				console.log(`${startTime} - ${endTime}`, `${startTime} - ${endTime}`);
				const button = document.createElement('button');
				button.classList.add('btn', 'btn-outline-primary', 'time-slot-button');
				button.textContent = `${startTime} - ${endTime}`; // Display time range
				button.onclick = () => {
					// Parse the date string
const date = new Date(slot.start_at);

// Format the date to "YYYY-MM-DD HH:mm:ss" without any UTC offset issues
const yearstart = date.getFullYear();
const monthstart = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
const daystart = String(date.getDate()).padStart(2, '0');
const hoursstart = String(date.getHours()).padStart(2, '0');
const minutesstart = String(date.getMinutes()).padStart(2, '0');
const secondsstart = String(date.getSeconds()).padStart(2, '0');

// Combine into the desired format
const formattedDatestart = `${yearstart}-${monthstart}-${daystart} ${hoursstart}:${minutesstart}:${secondsstart}`;

console.log(formattedDatestart);
const dateend = new Date(slot.end_at);

// Format the date to "YYYY-MM-DD HH:mm:ss" without any UTC offset issues
const yearend = dateend.getFullYear();
const monthend = String(dateend.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
const dayend = String(dateend.getDate()).padStart(2, '0');
const hoursend = String(dateend.getHours()).padStart(2, '0');
const minutesend = String(dateend.getMinutes()).padStart(2, '0');
const secondsend = String(dateend.getSeconds()).padStart(2, '0');

// Combine into the desired format
const formattedDateend = `${yearend}-${monthend}-${dayend} ${hoursend}:${minutesend}:${secondsend}`;

console.log(formattedDateend);
 
					// Format the time in "YYYY-MM-DD HH:mm:ss"
					/* const startTimeObj = new Date(slot.start_at).toISOString().slice(0, 19).replace("T", " ");
					const endTimeObj = new Date(slot.end_at).toISOString().slice(0, 19).replace("T", " "); */
					//console.log("startTimeObj: ",startTimeObj," new Date(slot.start_at): ", new Date(slot.start_at))
					selectedSlot = { // Set selectedSlot as an object
						appointment_at:formattedDatestart,
						start_at: formattedDatestart, // Store start_at from the slot
						ends_at: formattedDateend      // Store end_at from the slot
					};
					console.log("selectedSlot: ", selectedSlot)
					appointment = Object.assign(appointment, selectedSlot)
					console.log("object rdv: ",appointment)

				};

				td.appendChild(button); // Append button to cell
			} else {
				td.textContent = "--"; // Placeholder for no available slots
			}

			tr.appendChild(td); // Append the cell to the row
		});

		timeSlotsContainer.appendChild(tr); // Append the row to the table body
	}
}

// Navigate between weeks
function navigateWeek(direction) {
	currentWeekStart.setDate(currentWeekStart.getDate() + direction * 7);
	updateWeek();
}

// Confirm booking action
document.getElementById('confirmBooking').addEventListener('click', function () {
	alert(selectedSlot);
	$('#confirmationModal').modal('hide');
});




function Confirm() {
	console.log("appointment : ", appointment)
	const encryptedData = encryptData(appointment);
	sessionStorage.setItem("rendezvousClinic", encryptedData)
	if (sessionStorage.getItem('auth')) {
		const authData = sessionStorage.getItem("auth");
		const data = decryptData(authData);
		console.log("Initial login data: ", data);
		console.log("**************************************Rendez-vous Clinique")
		const rendezvousClinic = appointment;
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
		fetch("https://wic-doctor.com:3004/ajouterrendezvousclinic", requestOptions)
			.then(response => {
				if (!response.ok) {
					throw new Error('Erreur lors de l\'envoi des données');
				}
				return response.json(); // Analyser la réponse JSON
			})
			.then(data => {
				console.log('Réponse de l\'API :', data);
				if (data.message == "Rendez-vous inséré avec succès") {
					alert("🎉 Votre rendez-vous a été confirmé !\n\nVeuillez consulter votre email pour plus de détails.\n\nMerci de votre confiance !");
					sessionStorage.removeItem("rendezvousClinic")
					//window.location.href = 'mes-rendez-vous.html'; // Rediriger vers la page 2

				}
			})
			.catch(error => {
				console.error('Erreur :', error);
			});


	}

	else {
		window.location.href = 'login.html'; // Rediriger vers la page 2
	}



}





