if(OS_IOS){
	Ti.Media.hideCamera();
}

function doClick(e) {
    alert($.label.text);
}

$.index.open();

var cameraTransform = Ti.UI.create2DMatrix();
cameraTransform = cameraTransform.scale(1);
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
	transform : cameraTransform,
	mediaTypes : [Ti.Media.MEDIA_TYPE_PHOTO]
});

// $.getView().add(Alloy.createController('cameraOveray').getView());
