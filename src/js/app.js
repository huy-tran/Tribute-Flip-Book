jQuery(document).ready(function($) {
  function loadApp() {
  	$('.flipbook').turn({
  			// Width
  			width:960,
  			// Height
  			height:600,
  			// Elevation
  			elevation: 50,
  			// Enable gradients
  			gradients: true,
  			// Auto center this flipbook
  			autoCenter: true,
        // Duration
        duration: 2000
  	});
  }
  yepnope({
  	test : Modernizr.csstransforms,
  	yep: ['js/vendors.min.js'],
  	complete: loadApp
  });
});
