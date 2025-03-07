const cookies = document.cookie.split('; ').reduce((prev, current) => {
	const [key, value] = current.split('=');
	prev[key] = value;
	return prev;
}, {});
// Clé de chiffrement (doit être sécurisée)
const secretKey = "maCleSecrete";
// Fonction pour crypter
function encryptData(data) {
	return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
}
// Fonction pour crypter
function encryptData(data) {
	return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
}
// Fonction pour décrypter
function decryptData(cipherText) {
	const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
	return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}
console.log("sessionStorage.getItem('dataDetails'): ", decryptData(sessionStorage.getItem('dataDetails')))
Detailsdoctors = decryptData(sessionStorage.getItem('dataDetails'));
console.log("Detailsdoctors.name: ", JSON.stringify(Detailsdoctors))

/*Detailsdoctors.created_at*/
const date = new Date(Detailsdoctors.created_at);
const year = date.getFullYear();
const photos = Detailsdoctors.doctor_photo || "doctor.png";

document.getElementById("DoctorsDetails").innerHTML = document.getElementById("DoctorsDetails").innerHTML +
	`<div class="col-lg-6">
					<div class="card">
						<div class="card-body  item-user">
							<div class="profile-pic mb-0">
								<div class="d-md-flex">
									<img src="assets/images/media/doctors/${photos}" class="w-150 h-150 br-2" alt="user">
									<div class="ms-4">
										<a class="text-dark">
											<h4 class="mt-3 mb-1 font-weight-bold">${JSON.parse(Detailsdoctors.name).fr} <i
													class="ion-checkmark-circled  text-success fs-14 ms-1"></i></h4>
										</a>
										<span class="text-gray">${JSON.parse(Detailsdoctors.specialities[0].name).fr}</span><br>

										<span class="text-muted">Membre depuis ${year} </span><br>
										<div class="rating-stars d-inline-flex mb-2 me-3">
											<input type="number" readonly="readonly" class="rating-value star"
												name="rating-stars-value" value="4">
											
										</div>
										
									</div>
								</div>
							</div>
						</div>
						<div class="card-footer">
							<div class="wideget-user-tab">
								<div class="tab-menu-heading">
									<div class="tabs-menu1">
										<ul class="nav">
											<li class=""><a href="#tab-5" class="active"
													data-bs-toggle="tab">Description</a></li>
											
										</ul>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="card">
						<div class="card-body">
							<div class="border-0">
								<div class="tab-content">
									<div class="tab-pane active" id="tab-5">
										<div class="">
											<div class="mb-4">
												<p>${JSON.parse(Detailsdoctors.description).fr}</p>
												
											</div>
									
										</div>
									</div>
							
									<div class="tab-pane" id="tab-7">
										<div class="list-id">
											<div class="row">
												<div class="col-xl-12 col-md-12">
													<div class="table-responsive">
														<table class="table table-bordered border-top mb-0">
															<thead>
																<tr>
																	<th>Service Visit</th>
																	<th>Price</th>
																</tr>
															</thead>
															<tbody>
																<tr>
																	<td>Maternal-fetal medicine</td>
																	<td>$15</td>
																</tr>
																<tr>
																	<td>Reproductive endocrinology and infertility</td>
																	<td>$18</td>
																</tr>
																<tr>
																	<td>Female pelvic medicine and reconstructive
																		surgery</td>
																	<td>$18</td>
																</tr>
																<tr>
																	<td>Menopausal</td>
																	<td>$21</td>
																</tr>
																<tr>
																	<td>Laparoscopic surgery</td>
																	<td>$17</td>
																</tr>
																<tr>
																	<td>Pediatric and adolescent gynecology</td>
																	<td>$15</td>
																</tr>
															</tbody>
														</table>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					
					<!--	<div class="card-footer">
							<div class="btn-list">
								<a href="javascript:void(0);" class="btn btn-success icons"><i
										class="icon icon-note me-1"></i> </a>
							
							</div>
						</div> -->
					</div>
					
					
				</div>
				<div class="col-lg-6 ">
					<div class="card">
						<div class="card-header">
							<h3 class="card-title"></h3>
						</div>
						<div class="card-body">
							<div class="container mt-5">
								<h2 class="text-center mb-4">Prise de Rendez-vous</h2>
								<div class="row mb-3">
									<div class="col-1 nav-button">
										<button class="btn"  id="previousDays">❮</button> <!-- Left arrow -->
									</div>
									<div class="col-10">
										<table class="table">
											<thead>
												<tr id="days-header">
													<!-- Les jours de la semaine seront générés ici via JavaScript -->
												</tr>
											</thead>
											<tbody id="time-slots-container">
												<!-- Les créneaux horaires seront affichés ici -->
											</tbody>
										</table>
									</div>
									<div class="col-1 nav-button">
										<button class="btn" id="nextDays" >❯</button> <!-- Right arrow -->
									</div>
									 <!-- Champ de sélection des motifs -->
                                         <div id="motifSelection" class="mt-3" style="display: none;">
                                              <label for="motifSelect">Choisissez la raison de votre visite :</label>
                                                  <select class="form-control" id="motifSelect">
                                                     
                                                   </select>
    </div>
								</div>
							</div>
						
							<!-- Modal Structure -->
							<div class="modal fade" id="confirmationModal" tabindex="-1" role="dialog" aria-labelledby="confirmationModalLabel"
								aria-hidden="true">
								<div class="modal-dialog" role="document">
									<div class="modal-content">
										<div class="modal-header">
											<h5 class="modal-title" id="confirmationModalLabel">Confirmation de Réservation</h5>
											<button type="button" class="close" data-dismiss="modal" aria-label="Close">
												<span aria-hidden="true">&times;</span>
											</button>
										</div>
										   
										<div class="modal-body">
											Êtes-vous sûr de vouloir réserver ce créneau ?
										</div>
										<div class="modal-footer">
											<button type="button" class="btn btn-secondary" data-dismiss="modal">Annuler</button>
											<button type="button" class="btn btn-danger" id="confirmBooking">Confirmer</button>
										</div>
									</div>
								</div>
							</div>
						</div>
						<style>
									/* État désactivé avec animation de chargement */
									.btn-load:disabled {
										color: white;
										position: relative;
										cursor: not-allowed;
									}

									.btn-load:disabled::after {
										content: '';
										position: absolute;
										left: 50%;
										top: 50%;
										width: 20px;
										height: 20px;
										margin-left: -10px;
										margin-top: -10px;
										border: 3px solid white;
										border-radius: 50%;
										border-top-color: #007bff;
										animation: spin 1s linear infinite;
									}

									/* Animation de rotation */
									@keyframes spin {
										to {
											transform: rotate(360deg);
										}
									}
								</style>
						<div class="card-footer">
							<div class="btn-list">
								<a  id="confirmRDV" class="btn btn-success icons btn-load" onclick="ConfirmerRedezvous()"><i
										class="icon icon-note me-1 book-visit" ></i> Confirmer</a>
							
							</div>
						</div>
					</div>
				</div>
				`
const script = document.createElement('script');
script.src = 'assets/js/recherche.js';
document.body.appendChild(script);
//${Detailsdoctors.doctor_id}
console.log("Detailsdoctors.specialities[0].id ", Detailsdoctors.specialities[0])
fetch(`https://wic-doctor.com:3004/getmotif?specialite_id=${Detailsdoctors.specialities[0].id}&doctor_id=${Detailsdoctors.doctor_id}`)
	.then(response => {
		if (!response.ok) {
			throw new Error('Erreur lors de la récupération des catégories');
		}
		return response.json();
	})
	.then(data => {
		const select = document.getElementById('motifSelect');
		const optgroup = document.createElement('optgroup');
		optgroup.label = "";
		const defaultOption = document.createElement('option');
		defaultOption.value = '';
		defaultOption.textContent = 'Veuillez sélectionner une option...';
		defaultOption.disabled = true; // Désactive l'option pour ne pas la rendre sélectionnable
		defaultOption.selected = true; // Rend cette option sélectionnée par défaut
		optgroup.appendChild(defaultOption);
		data.forEach(item => {
			// Créer un <optgroup> pour chaque catégorie

			// Créer un <option> pour chaque élément de la catégorie

			console.log("item: ", item)
			const option = document.createElement('option');

			option.value = item.id;
			option.textContent = JSON.parse(item.nom).fr;
			optgroup.appendChild(option);
		});

		// Ajouter l'<optgroup> au <select>
		select.appendChild(optgroup);
	});
