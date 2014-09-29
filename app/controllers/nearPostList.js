exports.baseController = 'postList';
$.getView().title=L('nearList');

$.onFirstFocus = function(){
	$.listViewC.listView.contentTopOffset = -19;
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
			Ti.API.info('AUTHORIZATION_UNKNOWN');	// 허용 여부 묻기 전  
			
			$.listViewC.listView.visible = false;
			$.getView().add(requestView);
			break;
		case Ti.Geolocation.AUTHORIZATION_AUTHORIZED:
		case Ti.Geolocation.AUTHORIZATION_WHEN_IN_USE:
		case Ti.Geolocation.AUTHORIZATION_ALWAYS:
			Ti.API.info('AUTHORIZATION_AUTHORIZED');

			$.getView().remove( requestView);
			$.listViewC.listView.visible = true;
			fetchByCurrentPosition();
			break;
		default:
			break;
	}
};

AG.currentPosition.on('changeGeoAuth', geoAuthHandler);
Ti.App.addEventListener('resumed', geoAuthHandler);	// 설정 갔다 온 사용자를 위해서.
$.getView().addEventListener('focus', geoAuthHandler);
$.getView().addEventListener('focus', function(){
	Ti.Analytics.featureEvent('nearTab.focused');
});

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


