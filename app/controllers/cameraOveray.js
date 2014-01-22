var ImageFactory = require('ti.imagefactory');

var currentPosition = {},
	currentAddress = {};

var args = arguments[0],
	photoCol = args.collection;


function send(e) {
	Ti.Media.cameraFlashMode = Ti.Media.CAMERA_FLASH_OFF;
	Ti.Media.takePicture();
}
// $.sendBtn.addEventListener('click', send);
$.contentField.addEventListener('return', _.throttle(send,1000));


// facebook share toggle 
var toggleBtn = function(toggle){
	var flag, originTop;
	if( AG.settings.has("postWithFacebook") ){
		if(toggle){
			flag = !AG.settings.get('postWithFacebook');
		}else{
			flag = AG.settings.get('postWithFacebook');
		}
	}else{
		AG.settings.set('postWithFacebook', true);
	}
	
	if( timeoutId ){
		clearTimeout(timeoutId);
	}
	if(flag){
		$.fbDontShareGuidance.setOpacity(0);
		$.fbShareBtn.setBackgroundImage('images/fbShareActive.png');
		$.fbShareGuidance.setOpacity(1);
		timeoutId = setTimeout(function(){
			// $.fbShareGuidance.setVisible(false);
			$.fbShareGuidance.animate({
				duration: 1000,
				// top: 100,
				opacity : 0
			});
		}, 500 );
	}else{
		$.fbShareGuidance.setOpacity(0);
		$.fbShareBtn.setBackgroundImage('images/fbShareInactive.png');
		$.fbDontShareGuidance.setOpacity(1);
		timeoutId = setTimeout(function(){
			// $.fbDontShareGuidance.setVisible(false);
			$.fbDontShareGuidance.animate({
				duration: 1000,
				// top:100,
				opacity : 0
			});
		}, 500 );
	}
	AG.settings.set('postWithFacebook', flag);
	AG.settings.save();
};
var timeoutId;
$.fbShareBtn.addEventListener('click', function(){
	toggleBtn(true);
});


$.closeBtn.addEventListener('click', function(e) {
	if(OS_IOS){
		Ti.Media.hideCamera();
	}else{
		alert(Ti.Android);
		var activity = Ti.Android.currentActivity;
	}
});

$.contentField.addEventListener('change', function(e) {
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
	toggleBtn(false);
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
				Ti.Media.hideCamera();
			}
			Ti.API.info(event.media.width);
			Ti.API.info(event.media.height);
			var height = parseInt(catureSize.width*event.media.height/event.media.width);
			// event.media.imageAsCropped({
				// x: 0,
				// y: top,
				// width: 640,
				// height : height
			// })
			Ti.API.info(event.media.mimeType);
			var resizedImage = event.media.imageAsResized(catureSize.width,height);
			//Ti.API.info(resizedImage.width +',' + resizedImage.height);
			Ti.API.info(resizedImage.mimeType);
			var croppedImage = resizedImage.imageAsCropped({
				x: 0,
				y: catureSize.top,
				width: catureSize.width,
				height : catureSize.height
			});
			Ti.API.info(croppedImage.mimeType);
			//$.captureLabel.text = $.contentField.value.substr(0,5);

			var blob = ImageFactory.compress(croppedImage, 0.75);
			photoCol.create({
				title : $.contentField.value,
				photo : blob,
				user_id: AG.loggedInUser.get('id'),
				"photo_sizes[medium_320]" : "320x180",
				"photo_sizes[thumb_100]" : "100x100#",
				'photo_sync_sizes[]' :'original',
				custom_fields : {
					coordinates: [currentPosition.longitude, currentPosition.latitude ],
					address_ko : currentAddress.ko.results[0],
					address_en : currentAddress.en.results[0]
				}
			},{
				wait:true,
				success : function(nextModel){
					Ti.API.info(nextModel.attributes);
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
