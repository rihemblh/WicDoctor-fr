document.addEventListener('DOMContentLoaded', function () {

  // Clé de chiffrement (doit être sécurisée)
  // Clé de chiffrement (doit être sécurisée)
  var Login
  if (sessionStorage.getItem("auth")) {
    ////console.log("sessionStorage.getItem('auth'): ", sessionStorage.getItem("auth"))
    if (document.getElementById('SeConnecter'))
      document.getElementById('SeConnecter').style.display = "none "
    if (document.getElementById('B2B'))
      document.getElementById('B2B').style.display = "none"
    document.getElementById('Login').style.display = ""
    Login = decryptData(sessionStorage.getItem("auth"));
    ////console.log("Donne login: ", Login)
    ////console.log("Login.result[0]: ", Login.result[0], JSON.parse(Login.result[0].first_name).fr.charAt(0), JSON.parse(Login.result[0].last_name).fr.charAt(0))
    const userName = JSON.parse(Login.result[0].first_name).fr.charAt(0) + JSON.parse(Login.result[0].last_name).fr.charAt(0); // Replace with the variable holding the user's first name
    ////console.log("userName: ", userName)
    const initial = userName.toUpperCase();
    ////console.log("initial: ", initial)

    document.getElementById('userAvatar').textContent = initial;
    ////console.log("document.getElementById('userAvatar').textContent: ", document.getElementById('userAvatar').textContent)
    document.getElementById('userAvatar').style.backgroundColor = getRandomColor();

  }
  else {

    document.getElementById('SeConnecter').style.display = ""
    document.getElementById('B2B').style.display = ""
    document.getElementById('Login').style.setProperty("display", "none", "important");
    // document.getElementById('userDropdown').style.setProperty("display", "none", "important");



  }

  // Récupérer les données depuis l'API et créer les <optgroup>
 /*  fetch('https://wic-doctor.com:3004/specialtiesfrance')
    .then(response => {
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des catégories');
      }
      return response.json();
    })
    .then(data => {
      ////console.log("**************************************liste specialite : ", JSON.stringify(data))
      const select = document.getElementById('dynamicSelect');
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

        ////console.log("item: ", item)
        const option = document.createElement('option');
        option.value = JSON.parse(item.name).fr;
        option.textContent = JSON.parse(item.name).fr;
        optgroup.appendChild(option);
      });

      // Ajouter l'<optgroup> au <select>
      select.appendChild(optgroup);

      const selectclinic = document.getElementById('dynamicSelectClinic');
      const optgroupclinic = document.createElement('optgroup');
      optgroupclinic.label = "";
      const defaultOptionclinic = document.createElement('option');
      defaultOptionclinic.value = '';
      defaultOptionclinic.textContent = 'Veuillez sélectionner une option...';
      defaultOptionclinic.disabled = true; // Désactive l'option pour ne pas la rendre sélectionnable
      defaultOptionclinic.selected = true; // Rend cette option sélectionnée par défaut
      optgroupclinic.appendChild(defaultOptionclinic);
      data.forEach(item => {
        // Créer un <optgroup> pour chaque catégorie

        // Créer un <option> pour chaque élément de la catégorie

        ////console.log("item: ", item)
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = JSON.parse(item.name).fr;
        optgroupclinic.appendChild(option);
      });

      // Ajouter l'<optgroup> au <select>
      selectclinic.appendChild(optgroupclinic);

    }); */

  // Variables pour stocker les valeurs sélectionnées


  // Récupérer les départements depuis l'API
  fetch('https://wic-doctor.com:3004/getdepartements')
    .then(response => {
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des départements');
      }
      return response.json();
    })
    .then(departementsData => {
      // Récupérer les régions depuis l'API
      fetch('https://wic-doctor.com:3004/getregions')
        .then(response => {
          if (!response.ok) {
            throw new Error('Erreur lors de la récupération des régions');
          }
          return response.json();
        })
        .then(regionsData => {
          // Sélectionner l'élément du select
          const filterSelect = document.getElementById('filterSelect');
          
          // Créer le groupe des départements
          const departementsGroup = document.createElement('optgroup');
          departementsGroup.label = 'Départements';
          departementsData.forEach(item => {
            const option = document.createElement('option');
            option.textContent = item.département;
            option.value = item.département;
            departementsGroup.appendChild(option);
          });

          // Créer le groupe des régions
          const regionsGroup = document.createElement('optgroup');
          regionsGroup.label = 'Régions';
          regionsData.forEach(item => {
            const option = document.createElement('option');
            option.textContent = item.region;
            option.value = item.region;
            regionsGroup.appendChild(option);
          });

          // Ajouter les groupes au select
          filterSelect.innerHTML = ''; // Vider les options existantes
          filterSelect.appendChild(departementsGroup);
          filterSelect.appendChild(regionsGroup);

          // Initialiser Select2
          

          // Réinitialiser la sélection au chargement de la page
          $(filterSelect).val('').trigger('change'); // Forcer l'option vide à être sélectionnée

          // Écouter la sélection dans le select
          $(filterSelect).on('change', function() {
            const selectedValue = $(this).val(); // Récupérer la valeur sélectionnée

            if (regionsData.some(region => region.region === selectedValue)) {
              // Si une région est sélectionnée
              reg = selectedValue; // Assigner à reg la valeur de la région sélectionnée
              dep = ""; // Réinitialiser la valeur du département
              console.log("Région sélectionnée : ", reg);
            } else if (departementsData.some(dep => dep.département === selectedValue)) {
              // Si un département est sélectionné
              dep = selectedValue; // Assigner à dep la valeur du département sélectionné
              reg = ""; // Réinitialiser la valeur de la région
              console.log("Département sélectionné : ", dep);
            }
          });

        })
        .catch(error => {
          console.error('Erreur de récupération des régions:', error);
        });
    })
    .catch(error => {
      console.error('Erreur de récupération des départements:', error);
    });
  // Récupérer les données depuis l'API et créer les <optgroup>
  /*  fetch('https://wic-doctor.com:3004/getdepartements')
   .then(response => {
     if (!response.ok) {
       throw new Error('Erreur lors de la récupération des catégories');
     }
     return response.json();
   })
   .then(data => {
     ////console.log("**************************************liste departement : ", JSON.stringify(data))
     const select = document.getElementById('dynamicSelectdep');
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
 
       ////console.log("item: ", item)
       const option = document.createElement('option');
       option.value = item.département;
       option.textContent = item.département;
       optgroup.appendChild(option);
     });
 
     // Ajouter l'<optgroup> au <select>
     select.appendChild(optgroup);
 
     const selectclinic = document.getElementById('dynamicSelectClinic');
     const optgroupclinic = document.createElement('optgroup');
     optgroupclinic.label = "";
     const defaultOptionclinic = document.createElement('option');
     defaultOptionclinic.value = '';
     defaultOptionclinic.textContent = 'Veuillez sélectionner une option...';
     defaultOptionclinic.disabled = true; // Désactive l'option pour ne pas la rendre sélectionnable
     defaultOptionclinic.selected = true; // Rend cette option sélectionnée par défaut
     optgroupclinic.appendChild(defaultOptionclinic);
     data.forEach(item => {
       // Créer un <optgroup> pour chaque catégorie
 
       // Créer un <option> pour chaque élément de la catégorie
 
       ////console.log("item: ", item)
       const option = document.createElement('option');
       option.value = item.id;
       option.textContent = JSON.parse(item.name).fr;
       optgroupclinic.appendChild(option);
     });
 
     // Ajouter l'<optgroup> au <select>
     selectclinic.appendChild(optgroupclinic);
 
   });
   fetch('https://wic-doctor.com:3004/getregions')
   .then(response => {
     if (!response.ok) {
       throw new Error('Erreur lors de la récupération des catégories');
     }
     return response.json();
   })
   .then(data => {
     ////console.log("**************************************liste departement : ", JSON.stringify(data))
     const select = document.getElementById('dynamicSelectReg');
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
 
       ////console.log("item: ", item)
       const option = document.createElement('option');
       option.value = item.region;
       option.textContent = item.region;
       optgroup.appendChild(option);
     });
 
     // Ajouter l'<optgroup> au <select>
     select.appendChild(optgroup);
 
     const selectclinic = document.getElementById('dynamicSelectClinic');
     const optgroupclinic = document.createElement('optgroup');
     optgroupclinic.label = "";
     const defaultOptionclinic = document.createElement('option');
     defaultOptionclinic.value = '';
     defaultOptionclinic.textContent = 'Veuillez sélectionner une option...';
     defaultOptionclinic.disabled = true; // Désactive l'option pour ne pas la rendre sélectionnable
     defaultOptionclinic.selected = true; // Rend cette option sélectionnée par défaut
     optgroupclinic.appendChild(defaultOptionclinic);
     data.forEach(item => {
       // Créer un <optgroup> pour chaque catégorie
 
       // Créer un <option> pour chaque élément de la catégorie
 
       ////console.log("item: ", item)
       const option = document.createElement('option');
       option.value = item.id;
       option.textContent = JSON.parse(item.name).fr;
       optgroupclinic.appendChild(option);
     });
 
     // Ajouter l'<optgroup> au <select>
     selectclinic.appendChild(optgroupclinic);
 
   }); */
  /* fetch('https://wic-doctor.com:3004/getvilles')
    .then(response => {
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des catégories');
      }
      return response.json();
    })
    .then(data => {
      ////console.log("**************************************liste ville : ", JSON.stringify(data))
  
      const select = document.getElementById('dynamicSelectVille');
      const optgroup = document.createElement('optgroup');
      optgroup.label = "";
      const defaultOption = document.createElement('option');
      defaultOption.value = '';
      defaultOption.textContent = 'Veuillez sélectionner une option...';
      defaultOption.disabled = true; // Désactive l'option pour ne pas la rendre sélectionnable
      defaultOption.selected = true; // Rend cette option sélectionnée par défaut
      optgroup.appendChild(defaultOption);
      data.forEach(item => {
        ////console.log("item: ", item)
        // Créer un <optgroup> pour chaque catégorie
  
        // Créer un <option> pour chaque élément de la catégorie
  
        ////console.log("item: ", item)
        const option = document.createElement('option');
        let value = JSON.parse(item.ville)
        ////console.log("value ville json: ", value, "string: ", JSON.stringify(value))
        option.value = JSON.stringify(value);
        option.textContent = JSON.parse(item.ville).fr;
        optgroup.appendChild(option);
      });
  
      // Ajouter l'<optgroup> au <select>
      select.appendChild(optgroup);
  
      //for clinic
      const selectclinic = document.getElementById('dynamicSelectVilleClinic');
      const optgroupclinic = document.createElement('optgroup');
      optgroup.label = "";
      const defaultOptionclinic = document.createElement('option');
      defaultOptionclinic.value = '';
      defaultOptionclinic.textContent = 'Veuillez sélectionner une option...';
      defaultOptionclinic.disabled = true; // Désactive l'option pour ne pas la rendre sélectionnable
      defaultOptionclinic.selected = true; // Rend cette option sélectionnée par défaut
      optgroupclinic.appendChild(defaultOptionclinic);
      data.forEach(item => {
        // Créer un <optgroup> pour chaque catégorie
  
        // Créer un <option> pour chaque élément de la catégorie
  
        ////console.log("item: ", item)
        const option = document.createElement('option');
        let value = JSON.parse(item.ville)
        ////console.log("value ville json: ", value, "string: ", JSON.stringify(value))
        option.value = JSON.stringify(value);
        option.textContent = JSON.parse(item.ville).fr;
        optgroupclinic.appendChild(option);
      });
  
      // Ajouter l'<optgroup> au <select>
      selectclinic.appendChild(optgroupclinic);
    }); */

  const data = [
    { "ville": "{\"fr\":\"Ariana\"}" }, { "ville": "{\"fr\":\"Béja\"}" }, { "ville": "{\"fr\":\"Ben Arous\"}" }, { "ville": "{\"fr\":\"Bizerte\"}" },
    { "ville": "{\"fr\":\"Gabès\"}" }, { "ville": "{\"fr\":\"Gafsa\"}" }, { "ville": "{\"fr\":\"Jendouba\"}" }, { "ville": "{\"fr\":\"Kairouan\"}" },
    { "ville": "{\"fr\":\"Kasserine\"}" }, { "ville": "{\"fr\":\"Kébili\"}" }, { "ville": "{\"fr\":\"Le Kef\"}" }, { "ville": "{\"fr\":\"Mahdia\"}" },
    { "ville": "{\"fr\":\"La Manouba\"}" }, { "ville": "{\"fr\":\"Médenine\"}" }, { "ville": "{\"fr\":\"Monastir\"}" }, { "ville": "{\"fr\":\"Nabeul\"}" },
    { "ville": "{\"fr\":\"Sfax\"}" }, { "ville": "{\"fr\":\"Sidi Bouzid\"}" }, { "ville": "{\"fr\":\"Siliana\"}" }, { "ville": "{\"fr\":\"Sousse\"}" },
    { "ville": "{\"fr\":\"Tataouine\"}" }, { "ville": "{\"fr\":\"Tozeur\"}" }, { "ville": "{\"fr\":\"Tunis\"}" }, { "ville": "{\"fr\":\"Zaghouan\"}" }
  ];

  // Fonction pour remplir un select
  const populateSelect = (selectId) => {
    const select = document.getElementById(selectId);
    const optgroup = document.createElement('optgroup');
    optgroup.label = "";

    // Ajouter l'option par défaut
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Veuillez sélectionner une option...';
    defaultOption.disabled = true; // Désactive l'option pour ne pas la rendre sélectionnable
    defaultOption.selected = true; // Rend cette option sélectionnée par défaut
    optgroup.appendChild(defaultOption);

    // Ajouter les villes
    data.forEach(item => {
      const option = document.createElement('option');
      let value = JSON.parse(item.ville);
      option.value = JSON.stringify(value);
      option.textContent = value.fr;
      optgroup.appendChild(option);
    });

    // Ajouter l'<optgroup> au <select>
    select.appendChild(optgroup);
  };

  // Remplir les deux sélecteurs
  populateSelect('dynamicSelectVille');
  populateSelect('dynamicSelectVilleClinic');

  // Function to generate a random color
  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
  }

  // Ensure you define the variable in the global scope
  if (sessionStorage.getItem("auth")) {
    const authData = decryptData(sessionStorage.getItem("auth"));

    // Store user data in the global variable
    window.userData = {
      firstName: authData.result[0].first_name,
      lastName: authData.result[0].last_name
    };
    ////console.log("User Data Stored: ", window.userData); // Should log the stored data
  } else {
    console.error("User not authenticated.");
  }
});
var Login
  var dep = ""
  var  reg = ""
function Deconexion() {
  Login = decryptData(sessionStorage.getItem("auth"));
  ////console.log("Login: ", Login)
  const requestOptions = {
    method: 'POST', // ou 'GET', 'PUT', 'DELETE' selon votre besoin
    headers: {
      'Authorization': `Bearer ${Login.token}`, // Ajouter le token dans l'en-tête Authorization
      'Content-Type': 'application/json' // Type de contenu si vous envoyez des données
    },
  };
  ////console.log("Login.token: ",Login.token)
  // Appeler l'API
  fetch("https://wic-doctor.com:3004/logout", requestOptions)
    .then(response => {
      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi des données');
      }
      return response.json(); // Analyser la réponse JSON
    })
    .then(data => {
      ////console.log('Réponse de l\'API :', data);
      sessionStorage.removeItem('auth');
      sessionStorage.removeItem('rendezvous');

      window.location.href = 'https://wic-doctor.com/france/'; // Rediriger vers la page 2
    })
    .catch(error => {
      console.error('Erreur :', error);
    });
}
function RechercheDoctor() {
  if (document.getElementById('searchInput')) {
    query = document.getElementById('searchInput').value
    ////console.log("queryyyy*********************: ", query)
    if (query == "")
      sessionStorage.removeItem("query")
  }
  if (document.getElementById('searchInput2')) {
    query = document.getElementById('searchInput2').value
    ////console.log("queryyyy*********************: ", query)
    if (query == "")
      sessionStorage.removeItem("query")
  }

  var specialtyId = ""

  ////console.log("specialtyId before: ", specialtyId)
  ////console.log("Ville before: ", dep)
  ////console.log("Pays before: ", reg)
  const params = new URLSearchParams();
  ////console.log("document.getElementById('dynamicSelect'): ", document.getElementById('dynamicSelect').options[document.getElementById('dynamicSelect').selectedIndex].text)
  specialtyId = document.getElementById('dynamicSelect').value;
  ////console.log("selectValue: ", specialtyId)

  ////console.log("selectValue: ", reg)
  //Pays = document.getElementById('dynamicSelectPays').value;
  //////console.log("selectValue: ", Pays)

  /* 
  const newTitle = `WIC Doctor : Télémédecine pour ${username} (${specialty})`;
          const metaTitleTag = document.getElementById('metaTitle'); // Récupérer la balise meta par ID
          metaTitleTag.setAttribute('content', newTitle); // Mettre à jour l'attribut content
            // Log pour vérifier le changement
          ////console.log('Le contenu de la balise meta a été changé en :', newTitle);
          */


  var ListeDoctors
  var apiurlSearch = "https://wic-doctor.com:3004/doctorsadd?"
  var objectTitle = {}
  let currentPath = "https://wic-doctor.com/france/"
  ////console.log("currentPath: ", currentPath)
  sessionStorage.setItem('path', encryptData(currentPath))
  if (specialtyId != "") {
    params.append('speciality_id', specialtyId);
    objectTitle = Object.assign(objectTitle, { 'specialtyId': document.getElementById('dynamicSelect').options[document.getElementById('dynamicSelect').selectedIndex].text })
  }
  if (dep != "") {
    params.append('departement', dep);
    objectTitle = Object.assign(objectTitle, { 'departement': dep })

  }
  if (reg != "") {

    params.append('region', reg);
    objectTitle = Object.assign(objectTitle, { 'region': reg })

  }
  ////console.log("objectTitle: ",objectTitle)

  if (reg && dep && specialtyId)
  // Dynamically adjust all paths that start with ./../../
  {
    //console.log("**************************************************************if1")
    window.location.href = `${currentPath}medecin/${dep.replace(/\s+/g, '-').toLowerCase()}/${reg.replace(/\s+/g, '-').toLowerCase()}/${document.getElementById('dynamicSelect').options[document.getElementById('dynamicSelect').selectedIndex].text.replace(/\s+/g, '-').toLowerCase()}.html`;

  }
  else if (!reg && !dep && !specialtyId)
  // Dynamically adjust all paths that start with ./../../
  {
    //console.log("**************************************************************if2")
    window.location.href = `${currentPath}medecin/tous.html`;

  }
  else if (reg && dep)
  // Dynamically adjust all paths that start with ./../../
  {
    //console.log("**************************************************************if3")
    window.location.href = `${currentPath}medecin/${dep.replace(/\s+/g, '-').toLowerCase()}/${reg.replace(/\s+/g, '-').toLowerCase()}.html`;

  }
  else if (reg && specialtyId)
  // Dynamically adjust all paths that start with ./../../
  {
    //console.log("**************************************************************if4")
    window.location.href = `${currentPath}medecin/${reg.replace(/\s+/g, '-').toLowerCase()}/${document.getElementById('dynamicSelect').options[document.getElementById('dynamicSelect').selectedIndex].text.replace(/\s+/g, '-').toLowerCase()}.html`;

  }
  else if (dep && specialtyId)
  // Dynamically adjust all paths that start with ./../../
  {
    //console.log("**************************************************************if5")
    window.location.href = `${currentPath}medecin/${dep.replace(/\s+/g, '-').toLowerCase()}/${document.getElementById('dynamicSelect').options[document.getElementById('dynamicSelect').selectedIndex].text.replace(/\s+/g, '-').toLowerCase()}.html`;

  }
  else if (reg)
  // Dynamically adjust all paths that start with ./../../
  {
    //console.log("**************************************************************if6")
    window.location.href = `${currentPath}medecin/${reg.replace(/\s+/g, '-').toLowerCase()}.html`;

  }
  else if (dep)
  // Dynamically adjust all paths that start with ./../../
  {
    //console.log("**************************************************************if7")
    window.location.href = `${currentPath}medecin/${dep.replace(/\s+/g, '-').toLowerCase()}.html`;

  }
  else if (specialtyId)
  // Dynamically adjust all paths that start with ./../../
  {
    //console.log("**************************************************************if8")
    window.location.href = `${currentPath}medecin/${document.getElementById('dynamicSelect').options[document.getElementById('dynamicSelect').selectedIndex].text.replace(/\s+/g, '-').toLowerCase()}.html`;

  }
  const encryptDataTitle = encryptData(objectTitle)
  sessionStorage.setItem('title', encryptDataTitle)
  // Construire l'URL avec les paramètres
  const url = `${apiurlSearch}${params.toString()}`;
  ////console.log("apiurlSearch: ", url)
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des données');
      }
      return response.json();
    })
    .then(data => {
      ////console.log('Données récupérées:', data);
      ListeDoctors = data
      ////console.log("JSON.stringify(ListeDoctors): ", JSON.stringify(ListeDoctors))
      // Chiffrement de l'objet doctor
      const encryptedData = encryptData(ListeDoctors);
      ////console.log("Données chiffrées : ", encryptedData);
      sessionStorage.setItem('data', encryptedData);
      //window.location.href  = 'medecin.html'; // Rediriger vers la page 2
    })
    .catch(error => {
      ListeDoctors = []
      const encryptedData = encryptData(ListeDoctors);
      ////console.log("Données chiffrées : ", encryptedData);
      sessionStorage.setItem('data', encryptedData);
      //window.location.href = 'medecin.html'; // Rediriger vers la page 2
    });


}
// Récupérer les données depuis l'API et créer les <optgroup>
fetch('https://wic-doctor.com:3004/specialtiesfrance')
  .then(response => {
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des catégories');
    }
    return response.json();
  })
  .then(data => {
    ////console.log("**************************************liste specialite : ", JSON.stringify(data))
    const select = document.getElementById('dynamicSelect');
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

      ////console.log("item: ", item)
      const option = document.createElement('option');
      option.value = JSON.parse(item.name).fr;
      option.textContent = JSON.parse(item.name).fr;
      optgroup.appendChild(option);
    });

    // Ajouter l'<optgroup> au <select>
    select.appendChild(optgroup);

    const selectclinic = document.getElementById('dynamicSelectClinic');
    const optgroupclinic = document.createElement('optgroup');
    optgroupclinic.label = "";
    const defaultOptionclinic = document.createElement('option');
    defaultOptionclinic.value = '';
    defaultOptionclinic.textContent = 'Veuillez sélectionner une option...';
    defaultOptionclinic.disabled = true; // Désactive l'option pour ne pas la rendre sélectionnable
    defaultOptionclinic.selected = true; // Rend cette option sélectionnée par défaut
    optgroupclinic.appendChild(defaultOptionclinic);
    data.forEach(item => {
      // Créer un <optgroup> pour chaque catégorie

      // Créer un <option> pour chaque élément de la catégorie

      ////console.log("item: ", item)
      const option = document.createElement('option');
      option.value = item.id;
      option.textContent = JSON.parse(item.name).fr;
      optgroupclinic.appendChild(option);
    });

    // Ajouter l'<optgroup> au <select>
    selectclinic.appendChild(optgroupclinic);

  });
function RechercheClinic() {
  var specialtyIdClinic = ""
  var VilleClinic = ""
  var PaysClinic = ""
  ////console.log("specialtyIdClinic before: ", specialtyIdClinic)
  ////console.log("VilleClinic before: ", VilleClinic)
  ////console.log("Clinic before: ", PaysClinic)
  const params = new URLSearchParams();
  specialtyIdClinic = document.getElementById('dynamicSelectClinic').value;
  ////console.log("selectValue: ", specialtyIdClinic)
  VilleClinic = document.getElementById('dynamicSelectVilleClinic').value;
  ////console.log("selectValue: ", VilleClinic)
  PaysClinic = document.getElementById('dynamicSelectPaysClinic').value;
  ////console.log("selectValue: ", PaysClinic)

  /* 
  const newTitle = `WIC Doctor : Télémédecine pour ${username} (${specialty})`;
          const metaTitleTag = document.getElementById('metaTitle'); // Récupérer la balise meta par ID
          metaTitleTag.setAttribute('content', newTitle); // Mettre à jour l'attribut content
            // Log pour vérifier le changement
          ////console.log('Le contenu de la balise meta a été changé en :', newTitle);
          */


  var ListeClinics
  var apiurlSearch = "https://wic-doctor.com:3004/getclinicsspcitypay?"

  if (specialtyIdClinic != "") {
    params.append('speciality_id', specialtyIdClinic);
  }
  if (VilleClinic != "") {
    params.append('VilleClinic', VilleClinic);

  }
  if (PaysClinic != "") {

    params.append('PaysClinic', PaysClinic);

  }
  // Construire l'URL avec les paramètres
  const url = `${apiurlSearch}${params.toString()}`;
  ////console.log("apiurlSearch: ", url)
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des données');
      }
      return response.json();
    })
    .then(data => {
      ////console.log('Données récupérées:', data);
      ListeClinics = data
      ////console.log("JSON.stringify(ListeClinics): ", JSON.stringify(ListeClinics))
      // Chiffrement de l'objet doctor
      const encryptedData = encryptData(ListeClinics);
      ////console.log("Données chiffrées : ", encryptedData);
      sessionStorage.setItem('dataClinique', encryptedData);
      window.location.href = 'cliniques.html'; // Rediriger vers la page 2
    })
    .catch(error => {
      console.error('Erreur:', error);
    });


}
const secretKeyrech = "maCleSecrete";
// Fonction pour crypter
function encryptData(data) {
  return CryptoJS.AES.encrypt(JSON.stringify(data), secretKeyrech).toString();
}
/*11-12-2024*/
// Fonction pour décrypter
function decryptData(cipherText) {
  const bytes = CryptoJS.AES.decrypt(cipherText, secretKeyrech);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}
function SearchSpecialities(id, name) {
  ////console.log("id: ", id)
  var apiurlSearch = "https://wic-doctor.com:3004/doctorsadd?"
  const params = new URLSearchParams();
  let currentPath = decryptData(sessionStorage.getItem('origin'))
  ////console.log("currentPath: ", currentPath)
  sessionStorage.setItem('path', encryptData(currentPath))

  params.append('speciality_id', id);

  // Construire l'URL avec les paramètres
  const url = `${apiurlSearch}${params.toString()}`;
  ////console.log("apiurlSearch: ", url)
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des données');
      }
      return response.json();
    })
    .then(data => {
      ////console.log('Données récupérées:', data);
      ListeDoctors = data
      ////console.log("JSON.stringify(ListeDoctors): ", JSON.stringify(ListeDoctors))
      // Chiffrement de l'objet doctor
      const encryptedData = encryptData(ListeDoctors);
      ////console.log("Données chiffrées : ", encryptedData);
      sessionStorage.setItem('data', encryptedData);
      //window.location.href  = 'medecin.html'; // Rediriger vers la page 2
      window.location.href = `${currentPath}medecin/${name.replace(/\s+/g, '-').toLowerCase()}.html`;
    })
    .catch(error => {
      ListeDoctors = []
      const encryptedData = encryptData(ListeDoctors);
      ////console.log("Données chiffrées : ", encryptedData);
      sessionStorage.setItem('data', encryptedData);
      //window.location.href  = 'medecin.html'; // Rediriger vers la page 2
      window.location.href = `${currentPath}medecin/${name.replace(/\s+/g, '-').toLowerCase()}.html`;

    });
}
function toggleDropdown() {
  const dropdownMenu = document.getElementById("dropdownMenu");
  dropdownMenu.classList.toggle("show");
}
// Récupérer les données depuis l'API et créer les <optgroup>
/* fetch('https://wic-doctor.com:3004/specialtiesfrance')
  .then(response => {
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des catégories');
    }
    return response.json();
  })
  .then(data => {
    ////console.log("**************************************liste specialite : ", JSON.stringify(data))
    const select = document.getElementById('dynamicSelect');
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

      ////console.log("item: ", item)
      const option = document.createElement('option');
      option.value = JSON.parse(item.name).fr;
      option.textContent = JSON.parse(item.name).fr;
      optgroup.appendChild(option);
    });

    // Ajouter l'<optgroup> au <select>
    select.appendChild(optgroup);

    const selectclinic = document.getElementById('dynamicSelectClinic');
    const optgroupclinic = document.createElement('optgroup');
    optgroupclinic.label = "";
    const defaultOptionclinic = document.createElement('option');
    defaultOptionclinic.value = '';
    defaultOptionclinic.textContent = 'Veuillez sélectionner une option...';
    defaultOptionclinic.disabled = true; // Désactive l'option pour ne pas la rendre sélectionnable
    defaultOptionclinic.selected = true; // Rend cette option sélectionnée par défaut
    optgroupclinic.appendChild(defaultOptionclinic);
    data.forEach(item => {
      // Créer un <optgroup> pour chaque catégorie

      // Créer un <option> pour chaque élément de la catégorie

      ////console.log("item: ", item)
      const option = document.createElement('option');
      option.value = item.id;
      option.textContent = JSON.parse(item.name).fr;
      optgroupclinic.appendChild(option);
    });

    // Ajouter l'<optgroup> au <select>
    selectclinic.appendChild(optgroupclinic);

  }); */
/* fetch('https://wic-doctor.com:3004/getvilles')
  .then(response => {
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des catégories');
    }
    return response.json();
  })
  .then(data => {
    ////console.log("**************************************liste ville : ", JSON.stringify(data))

    const select = document.getElementById('dynamicSelectVille');
    const optgroup = document.createElement('optgroup');
    optgroup.label = "";
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Veuillez sélectionner une option...';
    defaultOption.disabled = true; // Désactive l'option pour ne pas la rendre sélectionnable
    defaultOption.selected = true; // Rend cette option sélectionnée par défaut
    optgroup.appendChild(defaultOption);
    data.forEach(item => {
      ////console.log("item: ", item)
      // Créer un <optgroup> pour chaque catégorie

      // Créer un <option> pour chaque élément de la catégorie

      ////console.log("item: ", item)
      const option = document.createElement('option');
      let value = JSON.parse(item.ville)
      ////console.log("value ville json: ", value, "string: ", JSON.stringify(value))
      option.value = JSON.stringify(value);
      option.textContent = JSON.parse(item.ville).fr;
      optgroup.appendChild(option);
    });

    // Ajouter l'<optgroup> au <select>
    select.appendChild(optgroup);

    //for clinic
    const selectclinic = document.getElementById('dynamicSelectVilleClinic');
    const optgroupclinic = document.createElement('optgroup');
    optgroup.label = "";
    const defaultOptionclinic = document.createElement('option');
    defaultOptionclinic.value = '';
    defaultOptionclinic.textContent = 'Veuillez sélectionner une option...';
    defaultOptionclinic.disabled = true; // Désactive l'option pour ne pas la rendre sélectionnable
    defaultOptionclinic.selected = true; // Rend cette option sélectionnée par défaut
    optgroupclinic.appendChild(defaultOptionclinic);
    data.forEach(item => {
      // Créer un <optgroup> pour chaque catégorie

      // Créer un <option> pour chaque élément de la catégorie

      ////console.log("item: ", item)
      const option = document.createElement('option');
      let value = JSON.parse(item.ville)
      ////console.log("value ville json: ", value, "string: ", JSON.stringify(value))
      option.value = JSON.stringify(value);
      option.textContent = JSON.parse(item.ville).fr;
      optgroupclinic.appendChild(option);
    });

    // Ajouter l'<optgroup> au <select>
    selectclinic.appendChild(optgroupclinic);
  }); */

const data = [
  { "ville": "{\"fr\":\"Ariana\"}" }, { "ville": "{\"fr\":\"Béja\"}" }, { "ville": "{\"fr\":\"Ben Arous\"}" }, { "ville": "{\"fr\":\"Bizerte\"}" },
  { "ville": "{\"fr\":\"Gabès\"}" }, { "ville": "{\"fr\":\"Gafsa\"}" }, { "ville": "{\"fr\":\"Jendouba\"}" }, { "ville": "{\"fr\":\"Kairouan\"}" },
  { "ville": "{\"fr\":\"Kasserine\"}" }, { "ville": "{\"fr\":\"Kébili\"}" }, { "ville": "{\"fr\":\"Le Kef\"}" }, { "ville": "{\"fr\":\"Mahdia\"}" },
  { "ville": "{\"fr\":\"La Manouba\"}" }, { "ville": "{\"fr\":\"Médenine\"}" }, { "ville": "{\"fr\":\"Monastir\"}" }, { "ville": "{\"fr\":\"Nabeul\"}" },
  { "ville": "{\"fr\":\"Sfax\"}" }, { "ville": "{\"fr\":\"Sidi Bouzid\"}" }, { "ville": "{\"fr\":\"Siliana\"}" }, { "ville": "{\"fr\":\"Sousse\"}" },
  { "ville": "{\"fr\":\"Tataouine\"}" }, { "ville": "{\"fr\":\"Tozeur\"}" }, { "ville": "{\"fr\":\"Tunis\"}" }, { "ville": "{\"fr\":\"Zaghouan\"}" }
];

// Fonction pour remplir un select
const populateSelect = (selectId) => {
  const select = document.getElementById(selectId);
  const optgroup = document.createElement('optgroup');
  optgroup.label = "";

  // Ajouter l'option par défaut
  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = 'Veuillez sélectionner une option...';
  defaultOption.disabled = true; // Désactive l'option pour ne pas la rendre sélectionnable
  defaultOption.selected = true; // Rend cette option sélectionnée par défaut
  optgroup.appendChild(defaultOption);

  // Ajouter les villes
  data.forEach(item => {
    const option = document.createElement('option');
    let value = JSON.parse(item.ville);
    option.value = JSON.stringify(value);
    option.textContent = value.fr;
    optgroup.appendChild(option);
  });

  // Ajouter l'<optgroup> au <select>
  select.appendChild(optgroup);
};

// Remplir les deux sélecteurs
populateSelect('dynamicSelectVille');
populateSelect('dynamicSelectVilleClinic');

fetch('https://wic-doctor.com:3004/getpays')
  .then(response => {
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des catégories');
    }
    return response.json();
  })
  .then(data => {
    ////console.log("**************************************liste pays : ", JSON.stringify(data))
    const select = document.getElementById('dynamicSelectPays');
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

      ////console.log("item: ", item)
      const option = document.createElement('option');
      let value = JSON.parse(item.pays)
      option.value = JSON.stringify(value);
      option.textContent = JSON.parse(item.pays).fr;
      optgroup.appendChild(option);
    });

    // Ajouter l'<optgroup> au <select>
    select.appendChild(optgroup);
    //for clinic
    const selectclinic = document.getElementById('dynamicSelectPaysClinic');
    const optgroupclinic = document.createElement('optgroup');
    optgroup.label = "";
    const defaultOptionclinic = document.createElement('option');
    defaultOptionclinic.value = '';
    defaultOptionclinic.textContent = 'Veuillez sélectionner une option...';
    defaultOptionclinic.disabled = true; // Désactive l'option pour ne pas la rendre sélectionnable
    defaultOptionclinic.selected = true; // Rend cette option sélectionnée par défaut
    optgroupclinic.appendChild(defaultOptionclinic);
    data.forEach(item => {
      // Créer un <optgroup> pour chaque catégorie

      // Créer un <option> pour chaque élément de la catégorie

      ////console.log("item: ", item)
      const option = document.createElement('option');
      let value = JSON.parse(item.pays)
      option.value = JSON.stringify(value);
      option.textContent = JSON.parse(item.pays).fr;
      optgroupclinic.appendChild(option);
    });

    // Ajouter l'<optgroup> au <select>
    selectclinic.appendChild(optgroupclinic);

  });
