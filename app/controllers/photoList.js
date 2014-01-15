var photoCol = Alloy.createCollection('photo');
photoCol.defaultFetchData = {
	order : "-created_at"
};

$.listViewC.setCollection(photoCol);

$.listHeaderView.parent.remove($.listHeaderView);
$.listViewC.topSection.headerView = $.listHeaderView;

$.listViewC.setTemplateControls([
	'photoItemTemplate'
]);

$.listViewC.on('itemclick',function(e){
	if(e.model){
		AG.utils.openController(AG.mainTabGroup.activeTab,
			'photoDetail',
			{
				photoModel : e.model //clicked Model
			}
		);
	}
});
photoCol.fetch();



function showCamera(){
	AG.loginController.requireLogin(function(){
			Alloy.createController('cameraOveray',{
				collection : photoCol
			}).showCamera();
	});
}

Titanium.Geolocation.getCurrentPosition(function(e){
	if (!e.success || e.error)
	{
		// currentLocation.text = 'error: ' + JSON.stringify(e.error);
		Ti.API.info("Code translation: "+translateErrorCode(e.code));
		alert('error ' + JSON.stringify(e.error));
		return;
	}
	AG.currentPosition.set(e.coords);	
	//photoCol.trigger('reset',photoCol);
});