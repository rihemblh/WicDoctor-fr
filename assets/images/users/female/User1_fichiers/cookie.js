$(document).ready(function() {
	$('body').ihavecookies({
		title: 'Acceptez-vous de nous laisser utiliser des cookies ?',
		message: 'Ce site utilise des cookies pour gérer les sessions utilisateurs de manière sécurisée. Nous ne stockons aucune donnée médicale dans les cookies. Veuillez consulter notre politique de confidentialité pour en savoir plus.',
		delay: 600,
		expires: 1,
		link: 'https://wic-doctor.com/Politique-de-confidentialit%C3%A9-et-d_utilisation-pour-les-sous-traitants.html',
		onAccept: function(){
			var myPreferences = $.fn.ihavecookies.cookie();
			console.log('Yay! The following preferences were saved...');
			console.log(myPreferences);
		},
		uncheckBoxes: true,
		acceptBtnLabel: 'Accepter',
		moreInfoLabel: 'Voir plus'
	});

	if ($.fn.ihavecookies.preference('marketing') === true) {
		console.log('This should run because marketing is accepted.');
	}
});