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
			if ($(document.activeElement).hasClass("category")) {
				window.open($(document.activeElement).attr("category"))
			} else if ($(document.activeElement).hasClass("media-featured")) {
				window.open($(document.activeElement).attr("video"))
			}
    		break;
    	case 10009: //RETURN button
			tizen.application.getCurrentApplication().exit();
    		break;
    	default:
    		console.log('Key code : ' + e.keyCode);
    		break;
    	}
    });
    SpatialNavigation.init();

      // Define navigable elements (anchors and elements with "focusable" class).
    SpatialNavigation.add({
      selector: '.category, .media-featured'
    });

	getCategories();
	getFeaturedVideo();

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
						$('.featured').append("<h3 class='display-5 position-absolute bottom-0 start-0 p-4 pb-5'>"+ media['title'] +"</h3>")
						$('.media-featured').attr('video', "player.html?category=" + val['key'] +"&id=" + media["naturalKey"] + "");
					});
				}
			});
		});

		$('.media-featured').SpatialNavigation().first().focus();
	});
}

function getCategories() {
	$.getJSON("https://b.jw-cdn.org/apis/mediator/v1/categories/F/VideoOnDemand?detailed=1&clientType=www", function (data) {
		$.each(data, function (key, val) {
			$('.content').append("<div class='row row-cols-4 gx-3 gy-4 categories'></div>");
			$.each(val, function (key, category) {
				if (key == "subcategories") {
					$.each(category, function (key, val) {
						$('.categories').append("<div class='col category text-center pb-3' category='category.html?category=" + val['key'] + "'><img class='rounded-4' src='" + val["images"]["wss"]["sm"] + "'/><h4 class='category-title text-center mt-2'>" + val['name'] +"</h4></div>");
					});
				}
			});
		});

		$('.category').SpatialNavigation().first().focus();
	});
}