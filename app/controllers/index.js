if(OS_IOS){
	Ti.Media.hideCamera();
}

function doClick(e) {
    alert($.label.text);
}

$.index.open();

Ti.Media.showCamera({
	success : function(event) {
		//alert('Your photo was saved to the Photo Gallery');
		Ti.Media.hideCamera();
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
	overlay : Alloy.createController('cameraOveray').getView(),
	saveToPhotoGallery : false,
	allowEditing : false,
	showControls : false,
	animated : false,
	autohide : false,
	transform : Ti.UI.create2DMatrix().scale(1),
	mediaTypes : [Ti.Media.MEDIA_TYPE_PHOTO]
});

// $.getView().add(Alloy.createController('cameraOveray').getView());
