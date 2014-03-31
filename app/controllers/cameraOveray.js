var ImageFactory = require('ti.imagefactory');

var currentPosition = {},
	currentAddress = {},
	foursquare = {};

var args = arguments[0],
	postCol = args.collection;

if(AG.settings.get("platformHeight") < 568){
	$.cameraOveray.remove($.mapWrap);
}

function send(e) {
	Ti.Media.cameraFlashMode = Ti.Media.CAMERA_FLASH_OFF;
	Ti.Media.takePicture();
}
$.sendBtn.addEventListener('click', _.throttle(send,1000));
// $.contentField.addEventListener('return', _.throttle(send,1000));
$.contentField.addEventListener('return', function(){
	$.shopNameField.focus();
});

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
$.shopNameField.addEventListener('return', function(){
	$.contentField.focus();
});



$.closeBtn.addEventListener('click', function(e) {
	if( $.shopNameField.hasText() ){
		// alert($.shopNameField.getValue()+"ddd");
	}
	if(OS_IOS){
		Ti.Media.hideCamera();
	}else{
		alert(Ti.Android);
		var activity = Ti.Android.currentActivity;
	}
});

$.contentField.addEventListener('change', function(e) {
	$.contentLabel.text = this.value;
});


// 현재 사용자 정보를 보여줌
$.hiddenProfile.image = AG.loggedInUser.getProfileImageUrl();
$.userName.text = AG.loggedInUser.get('first_name');





function getCurrentPosition(){
	// reverse geo
	Titanium.Geolocation.getCurrentPosition(function(e)
	{
		if (!e.success || e.error)
		{
			currentLocation.text = 'error: ' + JSON.stringify(e.error);
			Ti.API.info("Code translation: "+translateErrorCode(e.code));
			alert('error ' + JSON.stringify(e.error));
			return;
		}
	
		var longitude = e.coords.longitude;
		var latitude = e.coords.latitude;
		
		currentPosition.longitude = longitude;
		currentPosition.latitude = latitude;
		
		if(AG.settings.get("platformHeight") >= 568){
			var GoogleMapsClass = require('GoogleMaps');
			var GoogleMaps = new GoogleMapsClass({
				iOSKey: "***REMOVED***"
			});
			var mapView = GoogleMaps.initMap({
				latitude:latitude,
				longitude:longitude,
				zoom: 13, //15, 16이 적당해 보임
				width : Ti.UI.FILL,
				height : 108,
			});
			$.mapWrap.add(mapView);
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


exports.showCamera = function(){
	if(OS_IOS){
		Ti.Media.hideCamera();
	}
	var catureSize = _.clone(AG.cameraInfo);
	_.each(catureSize,function(value,key){
		catureSize[key]=value*2;
	});
	
					  
	Ti.API.info(catureSize);
	
	Ti.Media.showCamera({
		success : function(event) {
			if(OS_IOS){
				_.defer(function(){
					Ti.Media.hideCamera();
				});
			}
			
			Ti.API.info(event.media.width);
			Ti.API.info(event.media.height);
			Ti.API.info(event.media.mimeType);

			var height = parseInt(catureSize.width*event.media.height/event.media.width);
			var resizedImage = ImageFactory.imageAsResized(event.media, {
					width : catureSize.width,
					height : height
				});
			var croppedImage = ImageFactory.imageAsCropped(resizedImage,{
				x: 0,
				y: catureSize.top,
				width: catureSize.width,
				height : catureSize.height
			});

			//og:image 만들기위해 view를 변경하는 부분
			var fbPreviewFile;
			// if(AG.settings.get('postWithFacebook')){
				$.fieldWrap.width = 320;
				$.fieldWrap.height = 180;
				$.fieldOpacityBG.visible = false;
				// $.fieldOpacityBG2.visible = true;
				$.fieldWrap.backgroundImage = croppedImage;
				$.contentField.visible = false;
				$.contentLabel.visible = true;
				$.fakeCursor.visible = false;
				$.contentLabel.textAlign = 'right';
				fbPreviewFile = $.fieldWrap.toImage(null, true); 
			// }
			
			var blob = ImageFactory.compress(croppedImage, 0.75);
			
			//TODO : bug에 따른 임시 지정 
			postCol.recentBlob = blob;
			///
			
			postCol.create({
				title : $.contentField.value,
				content : '_#Are you hacker?? Free beer lover? Please contact us! (app@licky.co) :)#_',
				photo : blob,
				//user_id: AG.loggedInUser.get('id'),
				"photo_sizes[medium_320]" : "320x180",
				"photo_sizes[thumb_100]" : "100x100#",
				'photo_sync_sizes[]' :'original',
				custom_fields : {
					foursquare_venue_id: foursquare.venue_id,
					// foursquare_venue_name: foursquare.venue_name,
					venue_name: foursquare.venue_name,
					
					coordinates: [currentPosition.longitude, currentPosition.latitude ],
					address_ko: currentAddress.ko.results[0],
					address_en: currentAddress.en.results[0]
				}
			},{
				wait:true,
				success : function(nextPost){
					Ti.API.info(nextPost.attributes);
					
					// if(AG.settings.get('postWithFacebook')){
						var sharePhoto = Alloy.createModel('photo');
						sharePhoto.save({
							"collection_name" : "facebook_preview",
							"photo_sizes[medium_320]" : "320x180",
							'photo_sync_sizes[]' :'original',
		    				photo: ImageFactory.compress(ImageFactory.imageAsResized(fbPreviewFile,{
		    					width : 640,
								height :360
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
	getCurrentPosition();
};

function hiddenProfileOnLoad(){
	// _.find(this.parent.children,function(proxy){
		// return proxy.bindId === 'profileImage';
	// }).image = this.image;
	$.profileImage.image = this.image;
	//TODO : proxy찾는 하드코딩된 부분을 제거
}
