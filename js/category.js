//Initialize function
var init = function () {
    document.addEventListener('visibilitychange', function() {
        if(document.hidden){
            // Something you want to do when hide or exit.
        } else {
            // Something you want to do when resume.
        }
    });
 
    // add eventListener for keydown
    document.addEventListener('keydown', function(e) {
    	switch(e.keyCode){
    	case 37: //LEFT arrow
    		break;
    	case 38: //UP arrow
    		break;
    	case 39: //RIGHT arrow
    		break;
    	case 40: //DOWN arrow
    		break;
		case 10252: // PLAY PAUSE button
			break;
    	case 13: //OK button
			if ($(document.activeElement).hasClass("media")) {
				window.open($(document.activeElement).attr("video"))
			}
    		break;
    	case 10009: //RETURN button
			window.location.href = "index.html";
    		break;
    	default:
    		console.log('Key code : ' + e.keyCode);
    		break;
    	}
    });
    SpatialNavigation.init();

      // Define navigable elements (anchors and elements with "focusable" class).
    SpatialNavigation.add({
		selector: '.media, .header-wrap, .btn-jw, .media-featured'
    });

	getVideos();

	SpatialNavigation.makeFocusable();

      // Focus the first navigable element.
    SpatialNavigation.focus();
};
// window.onload can work without <body onload="">
window.onload = init;

function getFeaturedVideo() {
	$.getJSON("https://b.jw-cdn.org/apis/mediator/v1/categories/F/FeaturedLibraryVideos?detailed=1&clientType=www", function (data) {
		$.each(data, function (key, val) {
			$.each(val, function (key, category) {
				if (key == "media") {
					$.each(category, function (key, media) {
						$('.featured').append("<img class='rounded-4' src='" + media['images']['pnr']['lg'] + "' />");
						$('.featured').append("<h1 class='display-2 position-absolute bottom-0 start-0 p-4 pb-5'>" + media['title'] + "</h1>")
						$('.media-featured').attr('video', "player.html?category=" + val['key'] + "&id=" + media["naturalKey"] + "");
					});
				}
			});
		});

		$('.media-featured').SpatialNavigation().first().focus();
	});
}

function getVideos() {
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	const categoryParameter = urlParams.get('category');
	$.getJSON("https://b.jw-cdn.org/apis/mediator/v1/categories/F/"+ categoryParameter +"?detailed=1&clientType=www", function (data) {
		$.each(data, function (key, val) {
			$.each(val, function (key, category) {
				if (key == "subcategories") {
					$.each(category, function (key, val) {
						var items = [];

						if (val['tags'].includes("PNRFeaturedLayout")) {
							var count = 0;
							$.each(val["media"], function (key, video) {
								if (count == 0) {
									$('.featured').append("<img class='rounded-4' src='" + video['images']['pnr']['lg'] + "' />");
									$('.featured').append("<h3 class='display-5 position-absolute bottom-0 start-0 p-4 pb-5'>" + video['title'] + "</h3>")
									$('.media-featured').attr('video', "player.html?category=" + val['key'] + "&id=" + video["naturalKey"] + "");
									count =+ 1;
								}
							});
						} else {
							$('.content').append("<h5 class='display-5 m-2 subcategory'>" + val["name"] + "</h2>")

							// content medias carousel
							$('.content').append("<div class='owl-carousel owl-theme p-5' id='" + val['key'] + "'>")

							var category = document.getElementById(new String(val['key']));

							$.each(val["media"], function (key, video) {
								try {
									items.push("<div class='media-wrapper media item text-center pb-3 pt-4' video='player.html?category=" + categoryParameter + "&id=" + video["naturalKey"] + "'><img class='rounded-4' src='" + video["images"]["lss"]["lg"] + "'/><h3 class='video-title mt-3'>" + video['title'] + "</h3></div>");
								} catch (error) {
									try {
										items.push("<div class='media-wrapper media item text-center pb-3 pt-4' video='player.html?category=" + categoryParameter + "&id=" + video["naturalKey"] + "'><img class='rounded-4' src='" + video["images"]["wss"]["sm"] + "'/><h3 class='video-title mt-3'>" + video['title'] + "</h3></div>");
									} catch (error) {
										items.push("<div class='media-wrapper media item text-center pb-3 pt-4' video='player.html?category=" + categoryParameter + "&id=" + video["naturalKey"] + "'><img class='rounded-4' src='images/video.png'/><h3 class='video-title mt-3'>" + video['title'] + "</h3></div>");
									}
								}
							});
							$(category).html(items)
							$('.media').SpatialNavigation().first().focus();

							// content medias carousel end
							$('.content').append("</div>")
						}
					});
				}
			});
		});

		$('.media').SpatialNavigation().first().focus();

		$('.owl-carousel').owlCarousel({
			loop:false,
			margin:100,
			items:5,
			nav:false,
			dots:false,
			responsive: false
		});

		$('.featured-carousel').owlCarousel({
			loop: false,
			margin: 100,
			items: 1,
			nav: false,
			dots: false,
			responsive: false
		});
	});
}