var ImageFactory = require('ti.imagefactory');
var curWin = $.cameraOveray; 


var currentPosition = {},
	currentAddress = {},
	foursquare = {};

var args = arguments[0],
	postCol = args.collection;

if(AG.settings.get("platformHeight") < 568){
	// $.cameraOveray.remove($.mapWrap);
}

function send(e) {
	//Ti.Media.cameraFlashMode = Ti.Media.CAMERA_FLASH_OFF;
	//Ti.Media.takePicture();
	$.tiCamera.takePicture({
		saveToPhotoGallery: false,	// default false
		shutterSound: true,		// default true
		success: function(e){
			console.log(e);
			console.log('width: ' + e.media.width);
			console.log('height: ' + e.media.height);
			console.log('mime: ' + e.media.mime);
			//preview.setImage(e.media);
			createPostWithPhoto(e);
			
		},
		error: function(e){
			console.log(e);
		}
	});
}
// $.sendBtn.addEventListener('click', _.throttle(send,1000));
$.contentField.addEventListener('return', _.throttle(send,1000));
// $.contentField.addEventListener('return', function(){
	// $.shopNameField.focus();
// });

// guidance for facebook, twitter, etcs.. share 
var timeoutId, 
	guidanceBottom_down = $.guidanceLabel.getBottom(),
	guidanceBottom_up = guidanceBottom_down + $.guidanceLabel.getHeight() - $.guidanceLabel.getBorderRadius();
var showGuidance = function(message){
	if( timeoutId ){
		clearTimeout(timeoutId);
	}
	$.guidanceLabel.setText("   "+message+"   ");
	$.guidanceLabel.animate({
		duration: 60,
		bottom: guidanceBottom_up
	}, function(){
		timeoutId = setTimeout(function(){
			$.guidanceLabel.animate({
				duration: 60,
				bottom: guidanceBottom_down
			});
		}, 900);
	});
};
var setFbShareBtn = function(){
	if( AG.settings.get('postWithFacebook') ){
		showGuidance( L('willBePostedToFacebook') );
		$.fbShareBtn.setBackgroundImage('images/fbShareActive.png');
	}else{
		showGuidance( L('willNotShareOnFacebook')	);
		$.fbShareBtn.setBackgroundImage('images/fbShareInactive.png');
	}
};

$.fbShareBtn.addEventListener('click', function(){
	AG.settings.save('postWithFacebook', !AG.settings.get("postWithFacebook"), {
		success: function(){
			setFbShareBtn();
		}
	});
});


/**
 *  shop name
 */
$.suggestCompletionListC.setProps({
	position: currentPosition,
	textField: $.shopNameField
});
$.shopNameField.addEventListener('change', function(e){
	foursquare.venue_id = "";
	foursquare.venue_name = e.value;

	$.distance.setText( e.value +": "
		+ AG.utils.getGoogleShortAddress(currentAddress.ko.results[0]) );
});
$.shopNameField.addEventListener('suggestComplete', function(e){
	// alert(JSON.stringify(e.itemId));
	foursquare.venue_id = e.itemId;
	foursquare.venue_name = $.shopNameField.getValue();
	$.distance.setText( $.shopNameField.getValue() +": "
		+ AG.utils.getGoogleShortAddress(currentAddress.ko.results[0]) );
});
$.shopNameField.addEventListener('return', _.throttle(send,1000));



$.closeBtn.addEventListener('click', function(e) {
	if( $.shopNameField.hasText() ){
		// alert($.shopNameField.getValue()+"ddd");
	}
	if(OS_IOS){
		// Ti.Media.hideCamera();
		$.tiCamera.stopCamera();
		// $.tiCamera = null;
		// curWin.close();
		// curWin = null;
	}else{
		alert(Ti.Android);
		var activity = Ti.Android.currentActivity;
	}
});

$.contentField.addEventListener('change', function(e) {
	$.contentLabel.text = this.value;
});


// ?????? ??¬ì?©ì?? ???ë³´ë?? ë³´ì?¬ì??
$.hiddenProfile.image = AG.loggedInUser.getProfileImageUrl();
$.userName.text = AG.loggedInUser.get('first_name');





function getCurrentPosition(){
	// reverse geo
	// Titanium.Geolocation.getCurrentPosition(function(e){
	AG.currentPosition.update(function(e){
		var longitude = e.longitude;
		var latitude = e.latitude;
		if( !AG.currentPosition.get('success') ){
			return;
		}
		
		currentPosition.longitude = longitude;
		currentPosition.latitude = latitude;
		
		if(AG.settings.get("platformHeight") >= 568){
			// var GoogleMapsClass = require('GoogleMaps');
			// var GoogleMaps = new GoogleMapsClass({
				// iOSKey: "***REMOVED***"
			// });
			// var mapView = GoogleMaps.initMap({
				// latitude:latitude,
				// longitude:longitude,
				// zoom: 13, //15, 16??? ?????¹í?? ë³´ì??
				// width : Ti.UI.FILL,
				// height : 108,
			// });
			// $.mapWrap.add(mapView);
		}
		
		//alert(currentPosition);
		//mapView.setLocation(currentPosition);
		
		AG.utils.googleReverseGeo(_.extend({
			success: function(add){
				currentAddress.ko = add;
				
				if( AG.currentLanguage == 'ko'){
					$.distance.text = AG.utils.getGoogleShortAddress(add.results[0]);
				}
			},
			error: function(){
				
			},
			locale : 'ko'
		},currentPosition));
		
		
		
		AG.utils.googleReverseGeo(_.extend({
			success: function(add){
				currentAddress.en = add;
				
				if( AG.currentLanguage == 'en'){
					$.distance.text = AG.utils.getGoogleShortAddress(add.results[0]);
				}
			},
			error: function(){
				
			},
			locale: 'en-US'
		},currentPosition));
	});	
}


$.contentField.addEventListener('postlayout', function(e) {
	$.contentField.removeEventListener('postlayout',arguments.callee);
	$.contentField.focus();
	// toggleBtn(false);
	
	//fake cursor
	// $.fakeCursor.start();
	setFbShareBtn();
});


$.contentField.addEventListener('focus', function(){
	$.fieldWrap.setTouchEnabled(false);
	$.fakeCursor.setVisible(true);
	$.fakeCursor.start();
});
$.contentField.addEventListener('blur', function(){
	$.fieldWrap.setTouchEnabled(true);
	$.fakeCursor.stop();
	$.fakeCursor.setVisible(false);
});
$.fieldWrap.addEventListener('click', function(){
	$.contentField.focus();
});

var captureSize_2x = _.clone(AG.cameraInfo);
_.each(captureSize_2x,function(value,key){
	captureSize_2x[key]=value*2;
});

exports.showCamera = function(){
	getCurrentPosition();
	if(OS_IOS){
		curWin.open();
	}else{
		Ti.Media.showCamera({
			success : function(event) {
				Ti.API.info(event.media.width);
				Ti.API.info(event.media.height);
				Ti.API.info(event.media.mimeType);
	
				createPostWithPhoto(event);
			},
			cancel : function() {
			},
			error : function(error) {
				var message;
				if (error.code == Ti.Media.NO_CAMERA) {
					message = 'Device does not have video recording capabilities';
				} else {
					message = 'Unexpected error: ' + error.code;
				}
		
				Ti.UI.createAlertDialog({
					title : 'Camera',
					message : message
				}).show();
			},
			overlay : this.getView(),
			saveToPhotoGallery : false,
			allowEditing : false,
			showControls : false,
			animated : true,
			autohide : false,
			transform : Ti.UI.create2DMatrix().scale(1),
			mediaTypes : [Ti.Media.MEDIA_TYPE_PHOTO]
		});
	}
};

function hiddenProfileOnLoad(){
	$.profileImage.image = this.image;
}

function createPostWithPhoto(event){
	// ì¹´ë????¼ì?? ì°???? ê²???? ë¹???? ???ì§????ì²? ?????´ë?? 640(captureSize_2x.width)??? ë§????ë¡? ë¦¬ì?¬ì?´ì??
	var height = parseInt(captureSize_2x.width*event.media.height/event.media.width);
	var resizedImage = ImageFactory.imageAsResized(event.media, {
			width : captureSize_2x.width,
			height : height
		});
		
	// ì¹´ë????? height ??? ë§?ê²? crop
	var croppedImage = ImageFactory.imageAsCropped(resizedImage,{
		x: 0,
		y: captureSize_2x.top, //?????? ??«ê¸°ê°? ?????? nav ??????
		width: captureSize_2x.width,
		height : captureSize_2x.height
	});

	//og:image ë§???¤ê¸°?????? viewë¥? ë³?ê²½í????? ë¶?ë¶?
	var fbImageSize_2x = { 
			width : captureSize_2x.width,
			height : 340
		}; // 1.91 : 1 ??? ???ì§????ê³? 
		// https://developers.facebook.com/docs/opengraph/howtos/maximizing-distribution-media-content/
		
	// if(AG.settings.get('postWithFacebook')){
		
		// ìº¡ì?????ê¸? ?????´ì?? ë¶?????????? ë¶?ë¶? ê°?ì¶?ê³? ????????? ë¶?ë¶? ë³´ì?¸ë??.
		// $.fieldWrap.width = AG.cameraInfo.width;
		// $.fieldWrap.height = AG.cameraInfo.height;
		$.fieldOpacityBG.visible = false;
		$.fieldWrap.backgroundImage = croppedImage;

		// $.fieldOpacityBG2.visible = true;
		$.fakeCursor.visible = false;
		//ê°?ì§? textfiledê°? typing uxë¥? ?????? left ?????¬í??ê¸°ì?? ...??? ?????¤ë©´ ??¼ìª½??? ???ë¦¬ê?? ????????? ìº¡ì????? ?????? ??¤ë¥¸ìª½ì?? ë¶????ë¡?
		// $.contentLabel.textAlign = 'right';  
				$.contentLabel.visible = false;  
				
				$.captureTitle.text = $.contentLabel.text;
				
				$.captureContentImage.width = AG.cameraInfo.width;
				$.captureContentImage.height = AG.cameraInfo.height;
				$.captureContentImage.image = $.fieldWrap.toImage(null, true);
 
			// }
	
	var blob = ImageFactory.compress(croppedImage, 0.75);
	
	//TODO : bug??? ??°ë¥¸ ?????? ì§???? 
	postCol.recentBlob = blob;
	///
	var postContent = {
		title : $.contentField.value,
		content : '_#Are you hacker?? Free beer lover? Please contact us! (app@licky.co) :)#_',
		photo : blob,
		//user_id: AG.loggedInUser.get('id'),
		"photo_sizes[medium_320]" : AG.cameraInfo.width + 'x' + AG.cameraInfo.height,
		"photo_sizes[thumb_100]" : "100x100#",
		'photo_sync_sizes[]' :'original',
		custom_fields : {
			foursquare_venue_id: foursquare.venue_id,
			// foursquare_venue_name: foursquare.venue_name,
			venue_name: foursquare.venue_name,
			
			// coordinates: [currentPosition.longitude, currentPosition.latitude ],
			// address_ko: currentAddress.ko.results[0],
			// address_en: currentAddress.en.results[0]
		}
	};
	if( currentAddress.ko ){
		postContent.custom_fields.coordinates = [currentPosition.longitude, currentPosition.latitude ];
		postContent.custom_fields.address_ko = currentAddress.ko.results[0];
		postContent.custom_fields.address_en = currentAddress.en.results[0];
	}
	postCol.create(postContent,{
		wait:true,
		success : function(nextPost){
			Ti.API.info(nextPost.attributes);
			
			// if(AG.settings.get('postWithFacebook')){
				var sharePhoto = Alloy.createModel('photo');
				sharePhoto.save({
					"collection_name" : "facebook_preview",
					"photo_sizes[medium_320]" : AG.cameraInfo.width + 'x' + AG.cameraInfo.height,
					'photo_sync_sizes[]' :'original',
    				photo: ImageFactory.compress(ImageFactory.imageAsResized($.fbOgImageRenderView.toImage(null,true),{
    					width : fbImageSize_2x.width,
						height :fbImageSize_2x.height,
						hires : false
    				}), 0.2),
    				custom_fields : {
						"[ACS_Post]parent_id": nextPost.id
					}
				},
				{
					success : function(nextPreviewPhoto){
						//alert(nextPreviewPhoto.get('urls').original);
						if(AG.settings.get('postWithFacebook')){
							
							var goFacebook = function(){
								AG.facebook.requestWithGraphPath('me/links', {
									// message : "",
									link : 'http://www.licky.co/post/'+nextPost.id
									// link: 'http://dasolute.com/asdf3.html'
								}, "POST", function(e) {
									if (e.success) {
										//alert("Success!  From FB: " + e.result);
									} else {
										if (e.error) {
											//alert(e.error);
										} else {
											//alert("Unkown result");
										}
									}
								});
							};
							
							var cnt = 0;
							var checkAgain = function(){
								AG.Cloud.Photos.show({
									 photo_id: nextPreviewPhoto.id
								}, function (e) {
								    if (e.success) {
								        var photo = e.photos[0];
								        if(photo.processed){
								        	goFacebook();
								        	return;
								        }
								    }
								    
								    if(cnt++<10){
								    	setTimeout(checkAgain,5000);
								    }
								});
							};
							checkAgain();
						}

					}
				});
			// }
		}
	});
	
}
