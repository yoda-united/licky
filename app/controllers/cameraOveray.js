if(OS_IOS){
	setTimeout(function(){
		// Ti.Media.hideCamera();
	},3000);
}

$.sendBtn.addEventListener('click', function(e) {
	Ti.Media.takePicture();
});


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
	
	Titanium.Geolocation.reverseGeocoder(latitude,longitude,function(evt)
	{
		if (evt.success) {
			var places = evt.places;
			if (places && places.length) {
				$.geoLabel.text = places[0].address;
				// _.each(places,function(p){
					// $.geoLabel.text += p.address+'\n'; 
				// });
			} else {
				$.geoLabel.text = "No address found";
			}
			Ti.API.debug("reverse geolocation result = "+JSON.stringify(evt));
		}
		else {
			Ti.UI.createAlertDialog({
				title:'Reverse geo error',
				message:evt.error
			}).show();
			Ti.API.info("Code translation: "+translateErrorCode(e.code));
		}
	});	
});

$.geoLabel.addEventListener('postlayout', function(e) {
	$.geoLabel.removeEventListener('postlayout',arguments.callee);
	$.contentFiled.focus();
});

