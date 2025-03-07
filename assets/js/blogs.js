let apiUrl= 'https://wic-doctor.com:3004/blogs'
let href=""
async function fetchblogs() {
try {
	const response = await fetch(apiUrl);
	const data = await response.json();
	console.log("List blog: ",data)
    const blogs = data.data
    blogs.forEach(item => {
        if(item.titre == "Comment la télémédecine améliore l’accès aux soins dans les zones rurales")
            href='télémédecine-zones-rurales.html'
          if(item.titre == "Intelligence artificielle et télémédecine : comment les technologies transforment les soins")
            href='Intelligence-artificielle-et-télémédecine.html'
          if(item.titre == "Comment la télémédecine facilite la gestion des maladies chroniques")
            href='télémédecine-maladies-chroniques.html'
    document.getElementById('list-blog').innerHTML=document.getElementById('list-blog').innerHTML+
    `<div class="col-xl-4 col-lg-6 col-md-12">
								<div class="card">
									<div class="item7-card-img">
										<a href="javascript:void(0);"></a> <img alt="img" class="cover-image" src="assets/images/media/blogs/${item.image}">
										<div class="item7-card-text">
											<span class="badge bg-secondary">${item.catégorie}</span>
										</div>
									</div>
									<div class="card-body">
										<div class="item7-card-desc d-flex mb-2">
											<a href="javascript:void(0);"><i class="fa fa-calendar-o text-muted me-2"></i>${item.date}</a>
											
										</div><a class="text-dark" href="javascript:void(0);">
										<h4 class="font-weight-semibold mb-3">${item.titre}</h4></a>
										<a class="btn btn-primary btn-sm" href="${href}">Voir plus</a>
									</div>
								</div>
							</div>`
    })
  } catch (error) {
	console.error("Erreur lors de la récupération des données :", error);
	//document.getElementById('carouselSpecialities').innerHTML = '<p>Erreur lors du chargement des images.</p>';
  }
}
fetchblogs()