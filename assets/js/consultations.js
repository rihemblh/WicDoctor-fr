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
    // Fetch appointment history using the patient ID
    fetch(`https://wic-doctor.com:3004/appointments/${login.result[0].user_id}`, requestOptions)
        .then(response => response.json())
        .then(data => {
            const appointmentHistoryElement = document.getElementById("appointment-history-med");
            console.log("appointment:", data)
            // Clear any existing rows
            appointmentHistoryElement.innerHTML = '';

            // Populate the table with the received appointment data
            data.forEach(appointment => {
                const row = document.createElement('tr');

                // Separate date and time
                const appointmentDate = new Date(appointment.appointment_at);
                const formattedDate = appointmentDate.toLocaleDateString(); // Format the date
                const formattedTime = appointmentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Format the time

                console.log("formattedDate: ", formattedDate)
                console.log("formattedTime: ", formattedTime)
                // Create table cells for the row


                const doctorCell = document.createElement('td');
                doctorCell.textContent = JSON.parse(appointment.doctor_name).fr || ''; // Doctor information
                const clinicCell = document.createElement('td');
                if (appointment.clinic_name)
                    clinicCell.textContent = JSON.parse(appointment.clinic_name).fr
                else
                    clinicCell.textContent = "--"
                const statusCell = document.createElement('td');
                //statusCell.textContent = appointment.appointment_status || 'N/A'; // Appointment status
                if (appointment.appointment_status == "Received" || appointment.appointment_status == "In Progress" || appointment.appointment_status == "On the Way")
                    statusCell.innerHTML += `<a href="javascript:void(0);" class="badge bg-warning">Réservé</a>`
                else if (appointment.appointment_status == "Accepted" || appointment.appointment_status == "Ready" || appointment.appointment_status == "Done")
                    statusCell.innerHTML += `<a href="javascript:void(0);" class="badge  bg-success"">Validé</a>`
                else
                    statusCell.innerHTML += `<a href="javascript:void(0);" class="badge  bg-danger"">Annulé</a>`

                const appointmentDateCell = document.createElement('td');
                appointmentDateCell.textContent = formattedDate; // Display the formatted date

                const appointmentTimeCell = document.createElement('td');
                appointmentTimeCell.textContent = formattedTime; // Display the formatted time
                const appointmentActionsCell = document.createElement('td');
                if(appointment.appointment_status  != "Failed")
                appointmentActionsCell.innerHTML = appointmentActionsCell.innerHTML +

                    `
                	<!--<a href="#" onclick="EditAppointment(${appointment.iddoctor},${appointment.id})" class="btn btn-success btn-sm text-white" data-bs-toggle="tooltip" data-bs-original-title="Edit"><i class="fa fa-pencil"></i></a>-->
					<a href="#" onclick="CancelAppointment(${appointment.id})"     class="btn btn-danger btn-sm text-white" data-bs-toggle="tooltip" data-bs-original-title="Delete"><i class="fa fa-times-circle-o"></i></a>															
                `
                /*   const paymentCell = document.createElement('td');
                  paymentCell.textContent = appointment.payment_status !== null ? `${appointment.payment_status}` : 'N/A'; // Payment status
  
                  const paymentMethodCell = document.createElement('td');
                  paymentMethodCell.textContent = appointment.payment_method || 'N/A'; // Payment method */
                // Append cells to the row

                row.appendChild(doctorCell);
                row.appendChild(clinicCell)
                row.appendChild(statusCell);
                row.appendChild(appointmentDateCell);
                row.appendChild(appointmentTimeCell);
                row.appendChild(appointmentActionsCell);

                /*    row.appendChild(paymentCell);
                   row.appendChild(paymentMethodCell); */

                // Append the row to the table body
                appointmentHistoryElement.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching appointment history:', error);
            //alert('An error occurred while fetching appointment history.');
        });

} else {
    alert('User not authenticated. Please log in.');
}
function EditAppointment(id , appointmentid) {
    console.log("id doctor: ", id)
    fetch(`https://wic-doctor.com:3004/getdocbyid/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des données');
            }
            return response.json();
        })
        .then(data => {
            console.log('Données récupérées getdocbyid:', data);
            const encryptedData = encryptData(data);
            console.log("Données chiffrées : ", encryptedData);
            sessionStorage.setItem("dataDetails", encryptedData)
            sessionStorage.setItem("status", "edit")
console.log("appointmentid: ",appointmentid)
            sessionStorage.setItem("id", encryptData(appointmentid))

            window.location.href = 'prise-de-rendez-vous.html'; // Rediriger vers la page 2

            // Chiffrement de l'objet doctor

            // sessionStorage.setItem('data',encryptedData);
            // window.location.href = 'page-list.html'; // Rediriger vers la page 2
        })
        .catch(error => {
            console.error('Erreur:', error);
        });

    //sessionStorage.getItem('dataDetails')
    //window.location.href = 'prise-de-rendez-vous.html'; // Rediriger vers la page 2
}
function CancelAppointment(id) {
    //const isConfirmed = confirm("Êtes-vous sûr(e) de vouloir annuler ce rendez-vous ?");
    //if (isConfirmed) {
        Swal.fire({
            title: 'Êtes-vous sûr(e) ?',
            text: "Cette action annulera définitivement votre rendez-vous.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oui, annuler',
            cancelButtonText: 'Non, conserver'
        }).then((result) => {
            if (result.isConfirmed) {
    const requestOptions = {
        method: 'DELETE', // ou 'GET', 'PUT', 'DELETE' selon votre besoin
        headers: {
            'Authorization': `Bearer ${login.token}`, // Ajouter le token dans l'en-tête Authorization
            'Content-Type': 'application/json' // Type de contenu si vous envoyez des données
        },

    };
    // Fetch appointment history using the patient ID
    fetch(`https://wic-doctor.com:3004/appointmentscancel/${id}`, requestOptions)
        .then(response => response.json())
        .then(data => {
            console.log("resp cancel appointment: ", data)
            location.reload();
        })
        .catch(error => {
            console.error("Erreur :", error);
            Swal.fire(
                'Erreur',
                'Une erreur s\'est produite lors de l\'annulation.',
                'error'
            );
        });
    }
})
}
