var firstTimeLaunch = true;

//Initialize function
var init = function () {
	let videoElem = document.getElementById("player");
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	const id = urlParams.get('id');
	const urlCategory = urlParams.get('category');

    document.addEventListener('visibilitychange', function() {
        if(document.hidden){
            // Something you want to do when hide or exit.
        } else {
            // Something you want to do when resume.
        }
    });

	// add eventlistener for any keydown event
	document.addEventListener('keydown', function(e) {
		showControls();
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
			if (videoElem.paused) {
				videoElem.play();
			} else {
				videoElem.pause();
			}
			break;
    	case 13: //OK button
			if (videoElem.paused) {
				videoElem.play();
			} else {
				videoElem.pause();
			}
    		break;
    	case 10009: //RETURN button
			if (urlCategory == "FeaturedLibraryVideos") {
				window.location.href = "index.html";
			} else {
				window.location.href = "category.html?category=" + urlCategory;
			}
    		break;
		// list of key codes for Samsung Smart TV remote control
		// - https://keycode.info/
		// - https://developer.samsung.com/smarttv/develop/guides/user-interaction/remote-control.html
		// - https://developer.samsung.com/smarttv/develop/api-references/samsung-product-api-references/samsungproductapi-references-remotecontrol-keycodes.html
		case 10006: // EXIT button
			if (urlCategory == "FeaturedLibraryVideos") {
				window.location.href = "index.html";
			}
			else {
				window.location.href = "category.html?category=" + urlCategory;
			}
			break;
		case 10182: // INFO button
			showControls();
			break;
		case 10190: // TOOLS button
			showControls();
			break;
		case 10134: // CH LIST button
			showControls();
			break;
		case 10132: // MENU button
			showControls();
			break;
		case 10112: // GUIDE button
			showControls();
			break;
		case 10113: // TOOLS button
			showControls();
			break;
		case 10190: // TOOLS button
			showControls();
			break;
		case 10191: // MORE button
			showControls();
			break;
		case 10132: // MENU button
			showControls();
			break;
    	default:
    		console.log('Key code : ' + e.keyCode);
    		break;
    	}
    });

	getVideo();

	// add eventlistener for any video play event
	videoElem.addEventListener('play', function() {
		showControls();
	});

	// add eventlistener for any video pause event
	videoElem.addEventListener('pause', function() {
		showControls();
	});

	videoElement.addEventListener('error', function() {
		/* Video playback failed: show an error message */
		switch (videoElement.error.code) {
			case 1:
			// 'MEDIA_ERR_ABORTED : 1, Media data download is stopped by the user'
			if (urlCategory == "FeaturedLibraryVideos") {
				window.location.href = "index.html";
			} else {
				window.location.href = "category.html?category=" + urlCategory;
			}
			break;

			case 2:
			// 'MEDIA_ERR_NETWORK : 2, Download stopped due to network error'
			break;

			case 3:
			// 'MEDIA_ERR_DECODE : 3, Media data decoding failure'
			
			break;

			case 4:
			// 'MEDIA_ERR_SRC_NOT_SUPPORTED : 4, Format not supported'
			if (urlCategory == "FeaturedLibraryVideos") {
				window.location.href = "index.html";
			} else {
				window.location.href = "category.html?category=" + urlCategory;
			}
			break;
		}
	}, false);

	SpatialNavigation.init();

	// Define navigable elements (anchors and elements with "focusable" class).
	SpatialNavigation.add({
		selector: '#player, .qualitySelect'
	});

	SpatialNavigation.makeFocusable();

	// Focus the first navigable element.
	SpatialNavigation.focus();
};

// window.onload can work without <body onload="">
window.onload = init;

function getVideo() {
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	const id = urlParams.get('id');
	const urlCategory = urlParams.get('category');
	var sources = []
	$.getJSON("https://b.jw-cdn.org/apis/mediator/v1/categories/F/"+ urlCategory +"?detailed=1&clientType=www", function (data) {
		$.each(data, function (key, val) {
			$.each(val, function (key, category) {
				if ("subcategories" in val) {
					if (key == "subcategories") {
						$.each(category, function (key, val) {
							$.each(val["media"], function (key, video) {
								if (video["naturalKey"] == id) {
									$("#player").attr('poster', video["images"]["lsr"]["xl"])
									$.each(video["files"], function (key, file) {
										sources.push(file);
									});
								}
							});
						});
					}
				} else {
					if (urlCategory == "FeaturedLibraryVideos") {
						if (key == "media") {
							$.each(category, function (key, video) {
								if (video["naturalKey"] == id) {
									$("#player").attr('poster', video["images"]["lsr"]["xl"])
									$.each(video["files"], function (key, file) {
										sources.push(file);
									});
								}
							});
						}
					}
				}
			});
		});

		console.log(sources);

		sources.forEach(function (source) {
			$("#player").append("<source src='"+ source["progressiveDownloadURL"] +"' label='"+ source["label"] +"' type='video/mp4'/>");
		});
	});

	// select the highest quality video source
	var video = document.getElementById("player");
	video.addEventListener("loadedmetadata", function() {
		var playerVideo = document.getElementById("player");
		var qualitySelect = document.getElementById("qualitySelect");

		var sources = playerVideo.getElementsByTagName("source");
		var qualities = [];
		for (var i = 0; i < sources.length; i++) {
			qualities.push(sources[i].getAttribute("label"));
		}

		qualities.forEach(function(quality) {
			if (qualitySelect.options.length < qualities.length) {
				var option = document.createElement("option");
				option.text = quality;
				option.value = quality;
				qualitySelect.add(option);
			}
		});

		qualitySelect.addEventListener("change", function() {
			var selectedQuality = qualitySelect.options[qualitySelect.selectedIndex].value;
			for (var i = 0; i < sources.length; i++) {
				if (sources[i].getAttribute("label") == selectedQuality) {
					playerVideo.src = sources[i].src;
					playerVideo.play();
				}
			}
		});

		if (firstTimeLaunch == true) {
			qualitySelect.selectedIndex = qualities.length - 1;

			// if video quality isn't the one selected, change it
			if (playerVideo.src != sources[sources.length - 1].src) {
				playerVideo.src = sources[sources.length - 1].src;
				playerVideo.load();
				playerVideo.play();
			}

			firstTimeLaunch = false;
		}
	});
}

function windBackward() {
	let videoElem = document.getElementById("player");
  	if (videoElem.currentTime <= 5) {
  	  	window.location.href = "index.html";
  	} else {
  	  	videoElem.currentTime -= 5;
  	}
}

function windForward() {
	let videoElem = document.getElementById("player");
  	videoElem.currentTime += 15;
}
