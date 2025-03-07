let currentWeekStart = new Date();
let selectedSlot = '';

 // Fonction pour crypter
 function encryptData(data) {
    return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
}

// Fonction pour décrypter
function decryptData(cipherText) {
    const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}
console.log("sessionStorage.getItem('dataDetails'): ",decryptData(sessionStorage.getItem('dataDetails')))
Detailsdoctors = decryptData(sessionStorage.getItem('dataDetails'));
console.log("Detailsdoctors.name: ",Detailsdoctors.name)
fetch(`http:localhost:3000/afftempsdoctorsbyid?doctor_id=${Detailsdoctors.doctor_id}`)
  .then(response => {
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des catégories');
    }
    return response.json();
  })
  .then(data => {
    slotsData=data
    initializeWeek();
  })

function initializeWeek() {
    const today = new Date();
    const dayOfWeek = today.getDay() || 7; // Adjust to make Sunday 7 instead of 0
    currentWeekStart = new Date(today);
    currentWeekStart.setDate(today.getDate() - dayOfWeek + 1); // Start the week on Monday
    updateWeek();
}

function updateWeek() {
    const daysHeader = document.getElementById('days-header');
    const timeSlotsContainer = document.getElementById('time-slots-container');
    daysHeader.innerHTML = '';
    timeSlotsContainer.innerHTML = '';

    const days = [];
    // Generate 3 days from the current start date
    for (let i = 0; i < 3; i++) {
        const date = new Date(currentWeekStart);
        date.setDate(currentWeekStart.getDate() + i);
        const dayName = date.toLocaleDateString('fr-FR', { weekday: 'long' }); // Day name in lowercase        
        const dayDate = date.getDate();
        const month = date.toLocaleDateString('fr-FR', { month: 'long' });
        const year = date.getFullYear(); // Get the year

        days.push({ date, dayName });

        // Add a header for each day
        const th = document.createElement('th');
        th.classList.add('day-header');
        th.innerHTML = `<span class="dayname" >${dayName.toLowerCase()}</span><br><small class="date-month">${month.toLowerCase()} ${dayDate},${year}  </small>`;
        daysHeader.appendChild(th);
    }

    // Create a row for the time slots
    const tr = document.createElement('tr');

    // Fill the time slots for each day
    days.forEach(day => {
        const daySlots = slotsData.filter(slot => {
            const slotDate = new Date(slot.start_at);
            return slotDate.getUTCDate() === day.date.getUTCDate() &&
                   slotDate.getUTCMonth() === day.date.getUTCMonth() &&
                   slotDate.getUTCFullYear() === day.date.getUTCFullYear();
        });

        // Create a <td> for the day
        const td = document.createElement('td');

        // Create buttons for available time slots for the day
        daySlots.forEach(slot => {
            const startTime = new Date(slot.start_at).toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit'
            });
            const endTime = new Date(slot.end_at).toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit'
            });

            const button = document.createElement('button');
            button.classList.add('btn', 'time-slot-button');
            button.textContent = `${startTime} - ${endTime}`;
            button.onclick = () => {
                selectedSlot = `${day.dayName} ${day.date.getDate()}/${day.date.getMonth() + 1} à ${startTime}`;
                $('#confirmationModal').modal('show');
            };

            td.appendChild(button);
        });

        // Append the cell with time slots to the row
        tr.appendChild(td);
    });

    // Append the row of time slots to the container
    timeSlotsContainer.appendChild(tr);
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
document.getElementById('confirmBooking').addEventListener('click', () => {
    alert(`Réservé: ${selectedSlot}`);
    $('#confirmationModal').modal('hide');
});


