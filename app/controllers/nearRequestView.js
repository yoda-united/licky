var args = arguments[0] || {};



function geoAuthHandler(){
	alert(1);
	switch ( Ti.Geolocation.getLocationServicesAuthorization() ) {
		case Ti.Geolocation.AUTHORIZATION_RESTRICTED:	// 시스템 알람에서 위치정보 허용 안한 경우
		case Ti.Geolocation.AUTHORIZATION_DENIED:	// 시스템 알람에서 위치정보 허용 안하거나 꺼져 있는 경우(테스트 상으로는 이것만 나옴)
			// alert('AUTHORIZATION_DENIED' );
			$.guidanceLabel.setText( L("turnOnLocationAtSettings") );
			$.turnOnLocationImg.setVisible(true);
			$.requestBtn.setVisible(false);
			// 이제 환경설정에서 켜주는 거 넣을 차례 
			break;
		case Ti.Geolocation.AUTHORIZATION_UNKNOWN:
		case Ti.Geolocation.AUTHORIZATION_AUTHORIZED:
			break;
		default:
			break;
	}
};
geoAuthHandler();

Ti.App.addEventListener('changeGeoAuth', geoAuthHandler);

$.requestBtn.addEventListener('click', function(e){
	AG.currentPosition.getAuthorization(function(e){
		Ti.App.fireEvent('changeGeoAuth');
	});
});
