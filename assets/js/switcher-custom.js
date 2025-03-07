/***************** LIGHT THEME *********************/
$('#myonoffswitch56').click(function() {
	if (this.checked) {
		$('body').addClass('light-theme');
		$('body').removeClass('dark-theme');

		localStorage.removeItem("medzdark");
		localStorage.setItem("medzlight", true);
		checkOptions();

		const root = document.querySelector(':root');
		root.style = "";
		names()
	} 
	localStorageBackup();
});
/***************** LIGHT THEME *********************/

/***************** DARK THEME *********************/
$('#myonoffswitch57').click(function() {
	if (this.checked) {
		$('body').addClass('dark-theme');
		$('body').removeClass('light-theme');

		localStorage.removeItem("medzlight");
		localStorage.setItem("medzdark", true);
		checkOptions();

		localStorage.removeItem("medzbgColor");
		localStorage.removeItem("medzthemeColor");

		localStorage.setItem('dark-theme', true);
		localStorage.removeItem('light-theme', false);

		const root = document.querySelector(':root');
		root.style = "";
		names()
	} 
	localStorageBackup()
});
/***************** DARK THEME *********************/

/***************** LTR *********************/
$('#myonoffswitch54').click(function() {
	if (this.checked) {
		$('body').addClass('ltr');
		$('body').removeClass('rtl');
		$("html[lang=en]").attr("dir", "ltr");
		$(".select2-container").attr("dir", "ltr");
		localStorage.setItem("rtl", "false");
		$("head link#style").attr("href", $(this));
		(document.getElementById("style")?.setAttribute("href", "assets/plugins/bootstrap/css/bootstrap.min.css" ));
		var carousel = $('.owl-carousel');
		$.each(carousel ,function( index, element ) {
		// element == this
			var carouselData = $(element).data('owl.carousel');
			carouselData.settings.rtl = false; //don't know if both are necessary
			carouselData.options.rtl = false;
			$(element).trigger('refresh.owl.carousel');
		});
		
		localStorage.removeItem("medzrtl");
		localStorage.setItem("medzltr", true);
	} 
});
/***************** LTR *********************/

/***************** RTL *********************/
$('#myonoffswitch55').click(function() {
	if (this.checked) {
		$('body').addClass('rtl');
		$('body').removeClass('ltr');
		$("html[lang=en]").attr("dir", "rtl");
		$(".select2-container").attr("dir", "rtl");
		$("head link#style").attr("href", $(this));
		(document.getElementById("style")?.setAttribute("href","assets/plugins/bootstrap/css/bootstrap.rtl.min.css"));
		var carousel = $('.owl-carousel');
		$.each(carousel ,function( index, element ) {
		// element == this
			var carouselData = $(element).data('owl.carousel');
			carouselData.settings.rtl = true; //don't know if both are necessary
			carouselData.options.rtl = true;
			$(element).trigger('refresh.owl.carousel');
		});
		localStorage.setItem("medzrtl", true);
		localStorage.removeItem("medzltr");
	}
});
/***************** RTL *********************/


/***************** Header Style 1 *********************/
	$(document).on('click', '#myonoffswitch', function(e){
		if (this.checked) {
			$('body').addClass('headerstyle1');
			$('body').removeClass('headerstyle3');
			$('body').removeClass('headerstyle2');
			localStorage.setItem("headerstyle1", "True");
		}
		else {
			$('body').removeClass('headerstyle3');
			localStorage.setItem("headerstyle3", "false");
		}
	});

	
/***************** Header Style 2 *********************/
	$(document).on('click', '#myonoffswitch1', function(e){
		if (this.checked) {
			$('body').addClass('headerstyle3');
			$('body').removeClass('dark-header');
			$('body').removeClass('headerstyle2');
			$('body').removeClass('headerstyle1');
			localStorage.setItem("headerstyle3", "True");
		}
		else {
			$('body').removeClass('headerstyle3');
			localStorage.setItem("headerstyle3", "false");
		}
	});

	
/***************** Header Style 3 *********************/
	$(document).on('click', '#myonoffswitch2', function(e){
		if (this.checked) {
			$('body').addClass('headerstyle2');
			$('body').removeClass('headerstyle3');
			$('body').removeClass('headerstyle1');
			localStorage.setItem("headerstyle2", "True");
		}
		else {
			$('body').removeClass('headerstyle2');
			localStorage.setItem("headerstyle2", "false");
		}
	});

/***************** Horizontal-Menu Style 1 *********************/
	$(document).on('click', '#myonoffswitch3', function(e){
		if (this.checked) {
			$('body').addClass('default-menu');
			$('body').removeClass('menu-style1');
			$('body').removeClass('menu-style2');
			localStorage.setItem("default-menu", "True");
		}
		else {
			$('body').removeClass('default-menu');
			localStorage.setItem("default-menu", "false");
		}
	});

/***************** Horizontal-Menu Style 2 *********************/

	$(document).on('click', '#myonoffswitch4', function(e){
		if (this.checked) {
			$('body').addClass('menu-style1');
			$('body').removeClass('default-menu');
			$('body').removeClass('menu-style2');
			localStorage.setItem("menu-style1", "True");
		}
		else {
			$('body').removeClass('menu-style1');
			localStorage.setItem("menu-style1", "false");
		}
	});

/***************** Horizontal-Menu Style 3 *********************/
	$(document).on('click', '#myonoffswitch5', function(e){
		if (this.checked) {
			$('body').addClass('menu-style2');
			$('body').removeClass('default-menu');
			$('body').removeClass('menu-style1');
			localStorage.setItem("menu-style2", "True");
		}
		else {
			$('body').removeClass('menu-style2');
			localStorage.setItem("menu-style2", "false");
		}
	});



function checkOptions() {
	// rtl
	if (document.querySelector('body').classList.contains('rtl')) {
		$('#myonoffswitch55').prop('checked', true);
	}
	// ltr
	if (document.querySelector('body').classList.contains('ltr')) {
		$('#myonoffswitch54').prop('checked', true);
	}
	// Light-Theme
	if (document.querySelector('body').classList.contains('light-theme')) {
		$('#myonoffswitch56').prop('checked', true);
	}
	// Dark-Theme
	if (document.querySelector('body').classList.contains('dark-theme')) {
		$('#myonoffswitch57').prop('checked', true);
	}
	// Default-Header
	if (document.querySelector('body').classList.contains('headerstyle1')) {
		$('#onoffswitch2').prop('checked', true);
	}
	// Default-menu
	if (document.querySelector('body').classList.contains('default-menu')) {
		$('#onoffswitch3').prop('checked', true);
	}
}

/***************** RESET *********************/
function resetData() {
	$('#myonoffswitch54').prop('checked', true);
	$('#myonoffswitch56').prop('checked', true);
	$('#myonoffswitch3').prop('checked', true);
	$('#myonoffswitch').prop('checked', true);
	$('#myonoffswitch57').prop('checked', false);
	$('#myonoffswitch55').prop('checked', false);
	names();
	$('body')?.removeClass('light-theme');
	$('body')?.removeClass('dark-theme');
	$('body')?.removeClass('rtl');
	$('body')?.removeClass('ltr');
	$('body')?.removeClass('headerstyle3');
	$('body')?.removeClass('headerstyle2');
	$('body')?.removeClass('menu-style1');
	$('body')?.removeClass('menu-style2');
	$('body').addClass('headerstyle1');
	$('body').addClass('ltr');
	$('body').removeClass('rtl');
	$("html[lang=en]").attr("dir", "ltr");
	$(".select2-container--default").attr("dir", "ltr");
	$(".select2-dropdown--below").attr("dir", "ltr");
	$("head link#style").attr("href", $(this));
	(document.getElementById("style").setAttribute("href", "assets/plugins/bootstrap/css/bootstrap.min.css"));
	var carousel = $('.owl-carousel');
	$.each(carousel, function (index, element) {
		// element == this
		var carouselData = $(element).data('owl.carousel');
		carouselData.settings.rtl = false; //don't know if both are necessary
		carouselData.options.rtl = false;
		$(element).trigger('refresh.owl.carousel');
		window.dispatchEvent(new Event('resize'));
	});
}
/***************** RESET *********************/


	/***************** Add Switcher Classes *********************/

	if (!localStorage.getItem('medzrtl') && !localStorage.getItem('medzltr')) {

		/***************** RTL *********************/
		// $('body').addClass('rtl');
		/***************** RTL *********************/

		/***************** LTR *********************/
		// $('body').addClass('ltr');
		/***************** LTR *********************/

	}

	/***************** Add Switcher Classes *********************/

	if (!localStorage.getItem('medzrtl') && !localStorage.getItem('medzltr')) {

		/***************** RTL *********************/
		// $('body').addClass('rtl');
		/***************** RTL *********************/

		/***************** LTR *********************/
		// $('body').addClass('ltr');
		/***************** LTR *********************/

	}

	if (!localStorage.getItem('medzlight') && !localStorage.getItem('medzdark')) {

		/***************** Light THEME *********************/
		$('body').addClass('light-theme');
		/***************** Light THEME *********************/

		/***************** DARK THEME *********************/
		// $('body').addClass('dark-theme');
		/***************** Dark THEME *********************/
	}
	
	/***************** Default Header Start *********************/
		// $('body').addClass('headerstyle1');
		// $('body').removeClass('headerstyle2');
		// $('body').removeClass('headerstyle3');
	/***************** Default Header End *********************/

	/***************** Header Style 1 Start *********************/
		// $('body').addClass('headerstyle2');
		// $('body').removeClass('headerstyle1');
		// $('body').removeClass('headerstyle3');
	/***************** Header Style 1 End *********************/

	/***************** Header Style 2 Start *********************/
		// $('body').addClass('headerstyle3');
		// $('body').removeClass('headerstyle2');
		// $('body').removeClass('headerstyle1');
	/***************** Header Style 2 End *********************/

	/***************** Default Menu Start *********************/
		// $('body').addClass('default-menu');
	/***************** Default Menu End *********************/

	/***************** Menu Style 1 Start *********************/
		// $('body').addClass('menu-style1');
	/***************** Menu Style 1 End *********************/

	/***************** Menu Style 2 Start *********************/
		// $('body').addClass('menu-style2');
	/***************** Menu Style 2 End *********************/

	/***************** Add Switcher Classes *********************/


$(function () {
	"use strict";

	/***************** RTL HAs Class *********************/

	let bodyRtl = $('body').hasClass('rtl');
	if (bodyRtl) {
		$('body').addClass('rtl');
		$('body').removeClass('ltr');
		$("html[lang=en]").attr("dir", "rtl");
		$(".select2-container--default").attr("dir", "rtl");
		$(".select2-dropdown--below").attr("dir", "rtl");
		$("head link#style").attr("href", $(this));
		(document.getElementById("style").setAttribute("href", "assets/plugins/bootstrap/css/bootstrap.rtl.min.css"));
		var carousel = $('.owl-carousel');
		$.each(carousel ,function( index, element ) {
		// element == this
			var carouselData = $(element).data('owl.carousel');
			carouselData.settings.rtl = true; //don't know if both are necessary
			carouselData.options.rtl = true;
			$(element).trigger('refresh.owl.carousel');
		});
	}
	/***************** RTL HAs Class *********************/
    
});
