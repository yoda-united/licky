exports.baseController = 'postList';
$.getView().title=L('nearList');

$.onFirstFocus = function(){
	$.listViewC.listView.contentTopOffset = -19;
	geoAuthHandler();
};

var requestView = Alloy.createController('nearRequestView').getView();;
function geoAuthHandler(){
	switch ( Ti.Geolocation.getLocationServicesAuthorization() ) {
		case Ti.Geolocation.AUTHORIZATION_RESTRICTED:	// 시스템 알람에서 위치정보 허용 안한 경우
		case Ti.Geolocation.AUTHORIZATION_DENIED:	// 시스템 알람에서 위치정보 허용 안하거나 꺼져 있는 경우(테스트 상으로는 이것만 나옴)
			// alert('AUTHORIZATION_DENIED' );
			$.getView().remove( requestView);	// 이미 있을 수도 있는 requestView 삭제 
			$.listViewC.listView.visible = false;
			$.getView().add(requestView); 
			break;
		case Ti.Geolocation.AUTHORIZATION_UNKNOWN:
			Ti.API.info('AUTHORIZATION_UNKNOWN');		// 아직!
			
			$.listViewC.listView.visible = false;
			$.getView().add(requestView);
			break;
		case Ti.Geolocation.AUTHORIZATION_AUTHORIZED:
			Ti.API.info('AUTHORIZATION_AUTHORIZED');

			$.getView().remove( requestView);
			$.listViewC.listView.visible = true;
			fetchByCurrentPosition();
			break;
		default:
			break;
	}
};

Ti.App.addEventListener('changeGeoAuth', geoAuthHandler);
Ti.App.addEventListener('resumed', geoAuthHandler);	// 설정 갔다 온 사용자를 위해서.

function fetchByCurrentPosition(){
	AG.currentPosition.update( function(e){
		$.fetchWhereData = {
			"coordinates":{
				"$nearSphere": [AG.currentPosition.get('longitude'), 
							AG.currentPosition.get('latitude') ]
				//"$maxDistance" : 1000/6371 // km/6371 or mile/3959 )
			 }
		};
		
		$.fetchFirstCollection();			
	});
}

// Ti.App.addEventListener('focus:nearTab', function(e){
$.getView().addEventListener('focus', function(e) {
	// alert( Ti.Geolocation.getLocationServicesEnabled() );
	// alert( Ti.Geolocation.getLocationServicesAuthorization() );
Ti.App.fireEvent('changeGeoAuth');
	return;
	AG.currentPosition.update( function(){
		if( !AG.currentPosition.get('success') ){
			var dialog = Ti.UI.createAlertDialog({
			    message: L('locationServiceNeeded'),
			    ok: L('OK'),
			    title: L('notice')
			  });
			dialog.addEventListener('click', function(){
				$.index.setActiveTab(prevTabIndex);
			});
			dialog.show();
		}
	});
});

