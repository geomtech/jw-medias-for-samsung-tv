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
 
    // add eventListener for keydown
    document.addEventListener('keydown', function(e) {
    	switch(e.keyCode){
    	case 37: //LEFT arrow
			showControls();
			windBackward();
    		break;
    	case 38: //UP arrow
    		break;
    	case 39: //RIGHT arrow
			showControls();
			windForward();
    		break;
    	case 40: //DOWN arrow
			showControls();
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
    	default:
    		console.log('Key code : ' + e.keyCode);
    		break;
    	}
    });

	getVideo();

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
