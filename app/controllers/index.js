$.index.open();
// $.getView().add(Alloy.createController('cameraOveray').getView());

function showCamera(){
	AG.loginController.requireLogin(function(){
			Alloy.createController('cameraOveray').showCamera();
	});
}
