var args = arguments[0] || {},
	postModel =  args.postModel;

var GoogleMapsClass, GoogleMaps;

$.getView().addEventListener('open', function(e) {
	
	if(!GoogleMaps){
		(function(){
			GoogleMapsClass = require('GoogleMaps');
			GoogleMaps = new GoogleMapsClass({
				iOSKey: Ti.App.Properties.getString('google-map-ios-key')
			});
			var coord = postModel.get("custom_fields").coordinates;
			var geoAuth = Ti.Geolocation.getLocationServicesAuthorization();
			var mapView = GoogleMaps.initMap({
				latitude:coord[0][1],
				longitude:coord[0][0],
				zoom: 16, //15, 16이 적당해 보임
				// width : 304,
				// height : 119,
				// top:0,
				userLocation : (
					(geoAuth == Ti.Geolocation.AUTHORIZATION_ALWAYS) ||
					(geoAuth == Ti.Geolocation.AUTHORIZATION_WHEN_IN_USE)
				)?true:false
			});
			// $.mapWrap.setHeight(119);
			$.mapWrap.add(mapView);
			mapView.backgroundColor = 'white';
			
			var marker1 = GoogleMaps.createMarker({
				latitude:coord[0][1],
				longitude:coord[0][0],
				image: 'images/flag4map' //png 붙이지 마시오. tishadow에서 보려면 파일 변경후 다시 appify해야함
			});
			GoogleMaps.addMarker(marker1);
		})();
	}
});
