const secretKey = "maCleSecrete"; // Define your secret key here

// Fonction pour crypter
function encryptData(data) {
    return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
}
function decryptData(cipherText) {
    const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}

// Decrypt and retrieve user data from session storage
const authData = sessionStorage.getItem("auth");
var login
if (authData) {
    login = decryptData(authData);
    console.log("login: ", login)
    const patientId = login.result[0].id; // Assuming patient ID is stored in result[0]
    const userFirstName = JSON.parse(login.result[0].first_name).fr || ''; // Get the first name
    const userLastName = JSON.parse(login.result[0].last_name).fr || ''; // Get the last name
    console.log("${userFirstName} ${userLastName}", `${userFirstName} ${userLastName}`)
    // Update the <h4> element dynamically with user's first and last name
    const userNameElement = document.getElementById("user-name");
    if (userNameElement) {
        userNameElement.textContent = `${userFirstName} ${userLastName}`;

    }
    const requestOptions = {
        method: 'GET', // ou 'GET', 'PUT', 'DELETE' selon votre besoin
        headers: {
            'Authorization': `Bearer ${login.token}`, // Ajouter le token dans l'en-tête Authorization
            'Content-Type': 'application/json' // Type de contenu si vous envoyez des données
        },

    };
    console.log("`https://wicdoctor.com:3004/consultations/${login.result[0].id}`: ", `https://wic-doctor.com:3004/consultations/${login.result[0].id}`)
    // Fetch consultation history using the patient ID
    fetch(`https://wic-doctor.com:3004/consultations/${login.result[0].id}`, requestOptions)
        .then(response => response.json())
        .then(data => {
            const consultationHistoryElement = document.getElementById("consultation-history-med");
            console.log("consultation:", data)
            // Clear any existing rows
            consultationHistoryElement.innerHTML = '';

            // Populate the table with the received consultation data
            data.forEach(consultation => {
                const row = document.createElement('tr');

                // Separate date and time
                const consultationDate = new Date(consultation.dateConsultation);
                const formattedDate = consultationDate.toLocaleDateString(); // Format the date
                const formattedTime = consultationDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Format the time

                console.log("formattedDate: ", formattedDate)
                console.log("formattedTime: ", formattedTime)
                // Create table cells for the row


                const doctorCell = document.createElement('td');
                doctorCell.textContent = consultation.doctor_name || ''; // Doctor information
                const motifCell = document.createElement('td');
                motifCell.textContent = consultation.motif || ''; // Doctor information
                // Add CSS styles for text wrapping and overflow handling
                // Add CSS styles for text wrapping and line breaks
                motifCell.style.whiteSpace = 'normal';  // Allows text to wrap to the next line
                motifCell.style.wordWrap = 'break-word';  // Ensures long words break and wrap to the next line
                motifCell.style.overflowWrap = 'break-word'; // Alternative for long words, same effect
                const consultationDateCell = document.createElement('td');
                consultationDateCell.textContent = formattedDate; // Display the formatted date


                const consultationActionsCell = document.createElement('td');

                consultationActionsCell.innerHTML = consultationActionsCell.innerHTML +

                    `
                	
					<a href="#" style="    background: #18167a;border-color: #18167a;" onclick="prescriptionPDf(${consultation.id})"     class="btn btn-danger btn-sm text-white" data-bs-toggle="tooltip" data-bs-original-title="Delete"><i class="fas fa-notes-medical"></i></a>															
                `
                /*   const paymentCell = document.createElement('td');
                  paymentCell.textContent = appointment.payment_status !== null ? `${appointment.payment_status}` : 'N/A'; // Payment status
  
                  const paymentMethodCell = document.createElement('td');
                  paymentMethodCell.textContent = appointment.payment_method || 'N/A'; // Payment method */
                // Append cells to the row

                row.appendChild(doctorCell);
                row.appendChild(consultationDateCell);
                row.appendChild(motifCell);
                row.appendChild(consultationActionsCell);

                /*    row.appendChild(paymentCell);
                   row.appendChild(paymentMethodCell); */

                // Append the row to the table body
                consultationHistoryElement.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching appointment history:', error);
            //alert('An error occurred while fetching appointment history.');
        });

} else {
    alert("Authentification requise. Veuillez vous connecter.");
    window.location.href = "https://wic-doctor.com/france/login.html"
}

function prescriptionPDf(id) {
    console.log("********************id: ", id)
    const requestOptions = {
        method: 'POST', // ou 'GET', 'PUT', 'DELETE' selon votre besoin
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ record_id: id }) // Convertir l'objet en chaîne JSON
    };
    console.log("requestOptions: ", requestOptions)
    fetch("https://wic-doctor.com:3004/generate-pdf", requestOptions)
        .then(response => {
            console.log("response: ", response)
            return response.json(); // Analyser la réponse JSON
        })
        .then(data => {
            console.log("presciption pdf: ", data)
            window.open(data.url)
        })
        .catch(error => {

        });
}
