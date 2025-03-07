let currentWeekStart = new Date();
let selectedSlot = '';
let slotsData = [];

// Function to decrypt session storage data
function decryptData(cipherText) {
    const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}
function encryptData(data) {
    return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
}
//Detailsdoctors = decryptData(sessionStorage.getItem('dataDetails'));
let rdv = 0
if (sessionStorage.getItem("rdv")) {
    rdv = sessionStorage.getItem("rdv")
}
if (rdv == 0) {
    console.log("rendez-vous")
    // Fetching slots data for the doctor
    fetch(`https://wic-doctor.com:3004/afftempsdoctorsbyid?doctor_id=${Detailsdoctors.doctor_id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des créneaux');
            }
            return response.json();
        })
        .then(data => {
            console.log("availability: ", data)
            const config = {
                days: [
                    { day: "lundi", start_at: "08:00:00", end_at: "17:00:00" },
                    { day: "mardi", start_at: "09:00:00", end_at: "15:00:00" },
                    { day: "mercredi", start_at: "08:00:00", end_at: "17:00:00" },
                    { day: "jeudi", start_at: "08:00:00", end_at: "13:00:00" },
                    { day: "vendredi", start_at: "08:30:00", end_at: "17:30:00" },
                    { day: "samedi", start_at: "08:00:00", end_at: "12:00:00" },
                    { day: "dimanche", start_at: null, end_at: null },
                ],
                pauses: {
                    pause_start: "12:00:00",
                    pause_end: "13:00:00",
                },
                duree: 30,
                holidays: [
                    { holiday_from: "2024-12-23 00:00:00", holiday_to: "2024-12-31 00:00:00", holiday_type: "période" },
                ],
                indisponibles: [
                    { indisponible_date_debut: "2024-12-16T14:30:00", indisponible_date_end: "2024-12-16T15:30:00" },
                ],
                urgence: [
                    { jour: "2024-12-23", heurDebut: "12:55:56", heurFin: "14:55:56" },
                ],
            };

            // Generate slots
            const slotsData = generateTimeSlots(config);
            console.log(slotsData);
            console.log("slotsData: ", JSON.stringify(slotsData))
            initializeWeek();
        });
}
else {
    console.log("téléonsultation")

    fetch(`https://wic-doctor.com:3004/gettempsteleconsultation?doctor_id=${Detailsdoctors.doctor_id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des créneaux');
            }
            return response.json();
        })
        .then(data => {
            console.log("availability: ", data)
            slotsData = data;
            initializeWeek();
        });
}

/* // Fetching slots data for the doctor
fetch(`https://wic-doctor.com:3004/afftempsdoctorsbyid?doctor_id=${Detailsdoctors.doctor_id}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des créneaux');
        }
        return response.json();
    })
    .then(data => {
        console.log("availability: ", data)
        slotsData = data;
        initializeWeek();
    }); */

function initializeWeek() {
    const today = new Date();
    const dayOfWeek = today.getDay() || 7; // Adjust to make Sunday 7 instead of 0
    // Calculez le début de la semaine (en supposant que la semaine commence le Lundi)
    const currentWeekStart = new Date(today);
    currentWeekStart.setDate(today.getDate() - dayOfWeek + 1);
    updateWeek();
}
var encryptedData
var object = {}
function updateWeek() {
    const daysHeader = document.getElementById('days-header');
    const timeSlotsContainer = document.getElementById('time-slots-container');
    daysHeader.innerHTML = '';
    timeSlotsContainer.innerHTML = '';

    const days = [];
    // Generate 3 days starting from the current week start
    for (let i = 0; i < 3; i++) {
        const date = new Date(currentWeekStart);
        date.setDate(currentWeekStart.getDate() + i);
        const dayName = date.toLocaleDateString('fr-FR', { weekday: 'long' }).toLowerCase();
        const dayDate = date.getDate();
        const month = date.toLocaleDateString('fr-FR', { month: 'long' }).toUpperCase();

        days.push({ date, dayName });

        // Add a header for each day with line break
        const th = document.createElement('th');
        th.classList.add('day-header');
        th.innerHTML = `${dayName}<br><span class="date-month">${dayDate} ${month}</span>`;
        daysHeader.appendChild(th);
    }

    // Iterate through time slots based on available data
    const uniqueSlotsTimes = getUniqueSlotTimes(slotsData);
    console.log("uniqueSlotsTimes: ", JSON.stringify(uniqueSlotsTimes))
    uniqueSlotsTimes.forEach(time => {
        const tr = document.createElement('tr');

        days.forEach(day => {
            console.log("daaaaaaaaaaaaaaaaaay: ", day)
            const td = document.createElement('td');

            // Find if there's a slot at this time for this day
            const slot = slotsData.find(slot => {
                const slotDate = new Date(slot.start_at);
                const slotTime = new Date(slot.start_at).toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',


                });
                return (
                    slotDate.getUTCDate() === day.date.getUTCDate() &&
                    slotDate.getUTCMonth() === day.date.getUTCMonth() &&
                    slotDate.getUTCFullYear() === day.date.getUTCFullYear() &&
                    slotTime === time
                );
            });
            console.log("sloot for this day: ", slot)
            const button = document.createElement('button');
            button.classList.add('btn');

            if (slot) {
                const now = new Date(); // Date et heure actuelles
                console.log("new Date(slot.start_at) < now: ", slot.start_at, new Date(slot.start_at) < now)
                if (new Date(slot.start_at) < now) {
                    // If no appointment, display 'Aucun créneau'
                    button.classList.add('indsponible');
                    button.textContent = '--';
                    button.disabled = true;
                }
                else {
                    // If there's an available slot, show the time range
                    const startTime = new Date(slot.start_at).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit',


                    });
                    const endTime = new Date(slot.end_at).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit',


                    });
                    console.log("startTime: ", startTime, "endTime", endTime)
                    button.classList.add('disponible');
                    //button.textContent = `${startTime} - ${endTime}`;
                    button.textContent = `${startTime}`;
                    button.onclick = () => {
                        // Supprimer la classe 'selected-slot' des autres boutons
                        document.querySelectorAll('.btn.disponible').forEach(btn => {
                            btn.classList.remove('selected-slot');
                        });

                        // Ajouter la classe au bouton actuellement cliqué
                        button.classList.add('selected-slot');
                        let rdv = 0
                        if (sessionStorage.getItem("rdv")) {
                            rdv = sessionStorage.getItem("rdv")
                        }
                        if (rdv == 0) {
                            document.getElementById("motifSelection").style.display = ""
                        }

                        selectedSlotStart = `${day.dayName} ${day.date.getDate()}/${day.date.getMonth() + 1} à ${startTime}`;
                        selectedSlotEnd = `${day.dayName} ${day.date.getDate()}/${day.date.getMonth() + 1} à ${endTime}`;

                        const inputString = "mardi 15/10 à 10:00-11:00";

                        // Define the year
                        const currentDate = new Date();
                        const year = currentDate.getFullYear();

                        // Parse the input string
                        const [dayMonth, time] = selectedSlotStart.split(" à "); // Split by " à "
                        const [jour, month] = dayMonth.split(" ")[1].split("/"); // Get the day and month

                        // Format the output
                        const formattedDateStart = `${year}-${month.padStart(2, '0')}-${jour.padStart(2, '0')} ${time}`;

                        // Log the formatted date
                        console.log(formattedDateStart); // Output: "2024-10-15 10:00"


                        // Parse the input string
                        const [dayMonth2, time2] = selectedSlotEnd.split(" à "); // Split by " à "
                        const [jour2, month2] = dayMonth2.split(" ")[1].split("/"); // Get the day and month

                        // Format the output
                        const formattedDateEnd = `${year}-${month2.padStart(2, '0')}-${jour2.padStart(2, '0')} ${time2}`;

                        // Log the formatted date
                        console.log(formattedDateEnd); // Output: "2024-10-15 10:00"

                        object = Object.assign({ "appointment_at": formattedDateStart }, { "ends_at": formattedDateEnd }, { "start_at": formattedDateStart },
                            { "doctor_id": Detailsdoctors.doctor_id }, { "clinic": "" }, { "doctor": JSON.parse(Detailsdoctors.name).fr }, { "address": "" })
                        console.log("object rendez-vous: ", object)

                    };
                }
            } else {
                // If no appointment, display 'Aucun créneau'
                button.classList.add('indsponible');
                button.textContent = '--';
                button.disabled = true;
            }

            td.appendChild(button);
            tr.appendChild(td);
        });

        timeSlotsContainer.appendChild(tr);
    });
}

// Function to extract unique time slots from available data
function getUniqueSlotTimes(slotsData) {
    const times = slotsData.map(slot =>
        new Date(slot.start_at).toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',

        })
    );
    console.log("times: ", times)
    return [...new Set(times)].sort(); // Sort to display times in order
}

function navigateDays(direction) {
    // Increment or decrement by 3 days
    currentWeekStart.setDate(currentWeekStart.getDate() + direction * 3);
    updateWeek();
}

// Add event listeners for buttons to navigate between days
document.getElementById('nextDays').addEventListener('click', () => navigateDays(1));
document.getElementById('previousDays').addEventListener('click', () => navigateDays(-1));

// Logic for confirming booking
/* document.getElementById('confirmBooking').addEventListener('click', () => {
    //alert(`Réservé: ${selectedSlot}`);
    console.log("selectedSlot: ", selectedSlot)
    $('#confirmationModal').modal('hide');
}); */
var apiurl
var requestOptions
function ConfirmerRedezvous() {
    /// Prevent the default action (navigation)


    // Optionally, you can add a class to style it as disabled
    var link = document.getElementById('confirmRDV');
    link.classList.add('disabled');

    motifSelect = document.getElementById('motifSelect').value;
    console.log('sessionStorage.getItem("status"): ', sessionStorage.getItem("status"))
    if (sessionStorage.getItem("status") == "add") {
        console.log("add")
        let rdv = 0
        if (sessionStorage.getItem("rdv")) {
            rdv = sessionStorage.getItem("rdv")
        }
        if (rdv == 0) {
            apiurl = "https://wic-doctor.com:3004/ajouterrendezvous"
            object = Object.assign(object, { "motif_id": motifSelect })

        }
        else {
            apiurl = "https://wic-doctor.com:3004/ajouterrendezvoustele"
            //object = Object.assign(object, { "motif_id": motifSelect })


        }

    }
    else if (sessionStorage.getItem("status") == "edit") {
        console.log("edit")
        object = Object.assign({ "end_at": object.ends_at }, { "start_at": object.start_at }, { "patern_id": motifSelect })
        console.log("decryptData(sessionStorage.getItem('id')", decryptData(sessionStorage.getItem("id")))
        apiurl = `https://wic-doctor.com:3004/updateappointement/${decryptData(sessionStorage.getItem("id"))}`
    }
    console.log('apiurl: ', apiurl)
    encryptedData = encryptData(object);

    console.log("object rendez-vous: ", object)
    if (sessionStorage.getItem('auth')) {
        const authData = sessionStorage.getItem("auth");
        const data = decryptData(authData);
        console.log("Initial login data: ", data);
        console.log("**************************************Rendez-vous Medecin")
        const RendezVous = object;
        console.log("RendezVous: ", JSON.stringify(RendezVous))
        if (sessionStorage.getItem("status") == "add") {
            requestOptions = {
                method: 'POST', // ou 'GET', 'PUT', 'DELETE' selon votre besoin
                headers: {
                    'Authorization': `Bearer ${data.token}`, // Ajouter le token dans l'en-tête Authorization
                    'Content-Type': 'application/json' // Type de contenu si vous envoyez des données
                },
                body: JSON.stringify(RendezVous) // Convertir l'objet en chaîne JSON
            };

        }
        else if (sessionStorage.getItem("status") == "edit") {
            requestOptions = {
                method: 'PUT', // ou 'GET', 'PUT', 'DELETE' selon votre besoin
                headers: {
                    'Authorization': `Bearer ${data.token}`, // Ajouter le token dans l'en-tête Authorization
                    'Content-Type': 'application/json' // Type de contenu si vous envoyez des données
                },
                body: JSON.stringify(RendezVous) // Convertir l'objet en chaîne JSON
            }
        }



        // Appeler l'API
        fetch(apiurl, requestOptions)
            .then(response => {

                if (!response.ok) {
                    throw new Error('Erreur lors de l\'envoi des données');
                }
                return response.json(); // Analyser la réponse JSON
            })
            .then(data => {
                console.log('Réponse de l\'API :', data);

                if (data.message == "Rendez-vous inséré avec succès") {
                    let rdv = 0
                    if (sessionStorage.getItem("rdv")) {
                        rdv = sessionStorage.getItem("rdv")
                    }
                    if (rdv == 0) {
                        document.getElementById('popup').style.display = 'block';
                        document.getElementById('overlay').style.display = 'block';
                        alert("🎉 Votre rendez-vous a été confirmé !\n\nVeuillez consulter votre email / Téléphone pour plus de détails.\n\nMerci de votre confiance !");
                        sessionStorage.removeItem("rendezvousClinic")
                        window.location.href = 'https://wic-doctor.com/profil.html'; // Rediriger vers la page 2
                    }
                    else {
                        document.getElementById('popup').style.display = 'block';
                        document.getElementById('overlay').style.display = 'block';
                        alert("🎉 Votre demande de téléconsultation a été envoyée !\n\nVeuillez consulter votre email / Téléphone pour plus de détails.\n\nMerci de votre confiance !");
                        sessionStorage.removeItem("rendezvousClinic")
                        window.location.href = 'https://wic-doctor.com/profil.html'; // Rediriger vers la page 2
                        sessionStorage.removeItem("rdv")
                    }


                }
            })
            .catch(error => {
                console.error('Erreur :', error);
            });



    }

    else {
        sessionStorage.setItem("rendezvous", encryptedData)
        window.location.href = 'login.html'; // Rediriger vers la page 2
    }

}
// Fonction pour fermer la pop-up
function fermerPopup() {
    document.getElementById('popup').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}
initializeWeek();
const config = {
    "start": "08:00 AM",
    "end": "05:00 PM",
    "duree": 30,
    "indisponibles": ["2024-12-16:16:30", "2024-12-17:08:30"]
};

function generateTimeSlots(config) {
    const slots = [];
    const startDate = new Date(); // Today's date

    // Parse the config
    const daysConfig = config.days.reduce((acc, day) => {
        acc[day.day] = {
            start: day.start_at,
            end: day.end_at,
        };
        return acc;
    }, {});

    const { pauses, duree, holidays, urgence, indisponibles } = config;

    // Parse holidays into ranges
    const holidayRanges = holidays.map(holiday => ({
        from: new Date(holiday.holiday_from.split(' ')[0]),
        to: new Date(holiday.holiday_to.split(' ')[0]),
    }));

    // Parse indisponibles into ranges
    const unavailableRanges = indisponibles.map(indispo => ({
        from: new Date(indispo.indisponible_date_debut),
        to: new Date(indispo.indisponible_date_end),
    }));

    // Check if a date is within a holiday
    const isHoliday = (date) => holidayRanges.some(range => date >= range.from && date <= range.to);

    // Generate slots for 30 days
    for (let i = 0; i < 30; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(currentDate.getDate() + i);

        const dayName = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"][currentDate.getDay()];
        const daySchedule = daysConfig[dayName];

        if (!daySchedule || !daySchedule.start || !daySchedule.end || isHoliday(currentDate)) {
            continue; // Skip non-working days and holidays
        }

        const startTime = new Date(currentDate);
        const [startHour, startMinute] = daySchedule.start.split(":").map(Number);
        startTime.setHours(startHour, startMinute, 0, 0);

        const endTime = new Date(currentDate);
        const [endHour, endMinute] = daySchedule.end.split(":").map(Number);
        endTime.setHours(endHour, endMinute, 0, 0);

        const pauseStart = new Date(currentDate);
        const [pauseStartHour, pauseStartMinute] = pauses.pause_start.split(":").map(Number);
        pauseStart.setHours(pauseStartHour, pauseStartMinute, 0, 0);

        const pauseEnd = new Date(currentDate);
        const [pauseEndHour, pauseEndMinute] = pauses.pause_end.split(":").map(Number);
        pauseEnd.setHours(pauseEndHour, pauseEndMinute, 0, 0);

        let slotStart = new Date(startTime);

        // Generate slots for the day
        while (slotStart < endTime) {
            const slotEnd = new Date(slotStart);
            slotEnd.setMinutes(slotEnd.getMinutes() + duree);

            // Check if the slot is within unavailable or urgent intervals
            const isUnavailable = unavailableRanges.some(range => slotStart >= range.from && slotEnd <= range.to);
            const isDuringPause = slotStart >= pauseStart && slotStart < pauseEnd;

            if (slotEnd <= endTime && !isUnavailable && !isDuringPause) {
                slots.push({
                    start_at: slotStart.toISOString(),
                    end_at: slotEnd.toISOString(),
                });
            }

            slotStart = new Date(slotEnd); // Move to the next slot
        }
    }

    return slots;
}


// Exemple d'utilisation
/* const result = generateSlots(input);
console.log(result); */
