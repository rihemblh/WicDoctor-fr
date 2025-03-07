window.addEventListener('beforeunload', function (event) {
	// Exécutez votre action ici
	console.log('La page va être rechargée ou fermée.');

	// Si vous souhaitez afficher un message de confirmation (dans certains navigateurs)
	//window.location=currentPath
});
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
var currentPath = window.location.pathname;

Title = decryptData(sessionStorage.getItem('title'));
console.log("Title: ", Title)
textTitle = ""
if (Title.specialtyId) {
	console.log("title: ", Title.specialtyId)
	textTitle = `Trouvez un  ${Title.specialtyId}`;
	const newPath = currentPath.endsWith('/') ? `${currentPath}${Title.specialtyId}` : `${currentPath}/${Title.specialtyId}`;
	console.log("newPath: ", newPath)
	document.addEventListener('DOMContentLoaded', function () {

		window.history.pushState({}, '', newPath);
	})
	//window.history.pushState({}, '', `/${Title.specialtyId}`);
}
else
	textTitle = `Trouvez un Médecin`;

if (Title.Ville) {
	console.log("title: ", JSON.parse(Title.Ville).fr)
	textTitle = textTitle + ` a ${JSON.parse(Title.Ville).fr}`;
}
else
	textTitle = textTitle


/* // Afficher le contenu approprié lors du chargement initial
window.addEventListener('unload', function () {
	this.alert('gggggg')
		window.location=currentPath
}) */
document.title = textTitle
console.log('data:', sessionStorage.getItem('data')); // Accéder à la valeur du cookie
ListDoctors = decryptData(sessionStorage.getItem('data'));
console.log("**************************ListDoctors: ", ListDoctors)
ListDoctors.forEach(doctor => {
	// Chiffrement de l'objet doctor
	const photos = doctor.doctor_photo || "doctor.svg";
	console.log("********************************************************photots doc: ", photos)

	const encryptedData = encryptData(doctor);
	console.log("Données chiffrées : ", encryptedData);

	document.getElementById("List-doctors").innerHTML = document.getElementById("List-doctors").innerHTML +
		`<div class="card overflow-hidden">
											<div class="d-md-flex">
												<div class="item-card9-img">
													<div class="item-card9-imgs">
														<a href="#"  onclick="GetDetailsDoctor('${encryptedData}')" id="doctorDetails"></a>
														<img alt="img" class="cover-image"
															src="assets/images/media/doctors/${photos}">
													</div>
												
													
												</div>
												<div class="card border-0 mb-0">
													<div class="card-body">
														<div class="item-card9">
															<a href="#"  onclick="GetDetailsDoctor('${encryptedData}')" class="text-dark" >
																<h4 class="font-weight-bold mt-1 mb-1">Dr ${JSON.parse(doctor.name).fr}
																</h4>
															</a>
															<span class="text-muted fs-13 mt-0"><i
																	class="fa fa-user-md text-muted me-2"></i>${JSON.parse(doctor.specialities[0].name).fr}</span>
															<div class="item-card9-desc mb-0 mt-2">
																<span class="me-4 d-inline-block"><i
																		class="fa fa-map-marker text-muted me-1"></i>
																	${JSON.parse(doctor.ville).fr}</span>
																<span class="me-4"><i
																		class="fe fe-briefcase text-muted me-1"></i>${doctor.title}
																	d'expérience</span>
																
																<span class="me-4"><i
																		class="fe fe-phone text-muted me-1"></i>${doctor.phone_number}</span>
															</div>
														</div>
													</div>
													<div class="card-footer p-0">
														<div class="item-card9-footer btn-appointment">
															<div class="btn-group w-100">
																
																<a href="#" onclick="GetDetailsDoctor('${encryptedData}')"
																	class="btn btn-outline-light w-55 p-2 border-top-0 border-end-0 border-bottom-0 call-to-action" id="teleconsultation"><i
																		class="fe fe-eye  me-1 d-inline-block"></i>Téléconsultation</a>
																<a href="#"  onclick="GetDetailsDoctor('${encryptedData}')"
																	class="btn btn-outline-light w-55 p-2 border-top-0 border-end-0 border-bottom-0 call-to-action"
																	
																	data-bs-toggle="modal"><i
																		class="fe fe-phone  me-1 d-inline-block"></i>Rendez-vous</a>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>`
	const button = document.getElementById('teleconsultation');
	if (doctor.enable_online_consultation == 1)
		button.style.disabled = false;
	else
		button.disabled = true
});
function GetDetailsDoctor(doctorecrypted) {
	sessionStorage.setItem("dataDetails", doctorecrypted)
	sessionStorage.setItem("status", "add")
	window.location.href = 'prise-de-rendez-vous.html'; // Rediriger vers la page 2

}
