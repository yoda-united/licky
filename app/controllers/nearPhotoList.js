exports.baseController = 'photoList';
$.getView().title=L('nearList');

$.onFirstFocus = function(){
	$.listViewC.listView.contentTopOffset = -14;
	$.listViewC.listView.visible=true;
	fetchByCurrentPosition();
};


function fetchByCurrentPosition(){
	Titanium.Geolocation.getCurrentPosition(function(e){
		if (!e.success || e.error){
			currentLocation.text = 'error: ' + JSON.stringify(e.error);
			Ti.API.info("Code translation: "+translateErrorCode(e.code));
			alert('error ' + JSON.stringify(e.error));
			return;
		}
		
		$.fetchWhereData = {
			"coordinates":{
				"$nearSphere": [e.coords.longitude, e.coords.latitude],
				"$maxDistance" : 5/6371 // km/6371 or mile/3959 )
			 }
		};
		
		$.fetchFirstCollection();
	});
}


