var currentWindow = $.photoList;

function showCamera(){
	AG.loginController.requireLogin(function(){
			Alloy.createController('cameraOveray',{
				collection : photoCol
			}).showCamera();
	});
}

var photoCol = Alloy.createCollection('photo');
var items = []; 


photoCol.on('reset add',function(col){
	items = [];
	photoCol.each(function(photo){
		Ti.API.info(photo.attributes);
		var item = photo.doDefaultTransform();
		
		items.push(item);
	});
	$.section.setItems(items);
});

$.listView.addEventListener('itemclick', function(e) {
	if(e.itemId){
		AG.utils.openController(AG.mainTabGroup.activeTab,
			'photoDetail',
			{
				photoModel : photoCol.get(e.itemId) //clicked Model
			}
		);
	}
});

photoCol.fetch();

Titanium.Geolocation.getCurrentPosition(function(e){
	if (!e.success || e.error)
	{
		currentLocation.text = 'error: ' + JSON.stringify(e.error);
		Ti.API.info("Code translation: "+translateErrorCode(e.code));
		alert('error ' + JSON.stringify(e.error));
		return;
	}
	AG.currentPosition.set(e.coords);	
	photoCol.trigger('reset');
});


//TEST CODE
// currentWindow.addEventListener('open', function(e) {
	// var cacheModel = Alloy.createModel('photo');
	// cacheModel.set({"id":"528c6a3f00de2c0b32001120","filename":"175d6f20.png","size":498765,"md5":"b85ab0884d1b5e08707f0aed5f1fe487","created_at":"2013-11-20T07:52:31+0000","updated_at":"2013-11-20T07:52:36+0000","processed":true,"user":{"id":"52841ff87bf3190b300173ea","first_name":"jongeun","last_name":"lee","created_at":"2013-11-14T00:57:28+0000","updated_at":"2013-11-14T00:57:28+0000","external_accounts":[{"external_id":"1417938346","external_type":"facebook"}],"confirmed_at":"2013-11-14T00:57:28+0000","admin":"false"},"title":"이건 왜 자꾸 줄어드는 기분이지?","urls":{"square_75":"http://storage.cloud.appcelerator.com/P9mmtk4COHPiuvp1GF18IpnE8ydCbbRl/photos/e4/87/528c6a3f00de2c0b32001121/175d6f20_square_75.png","thumb_100":"http://storage.cloud.appcelerator.com/P9mmtk4COHPiuvp1GF18IpnE8ydCbbRl/photos/e4/87/528c6a3f00de2c0b32001121/175d6f20_thumb_100.png","small_240":"http://storage.cloud.appcelerator.com/P9mmtk4COHPiuvp1GF18IpnE8ydCbbRl/photos/e4/87/528c6a3f00de2c0b32001121/175d6f20_small_240.png","medium_500":"http://storage.cloud.appcelerator.com/P9mmtk4COHPiuvp1GF18IpnE8ydCbbRl/photos/e4/87/528c6a3f00de2c0b32001121/175d6f20_medium_500.png","medium_640":"http://storage.cloud.appcelerator.com/P9mmtk4COHPiuvp1GF18IpnE8ydCbbRl/photos/e4/87/528c6a3f00de2c0b32001121/175d6f20_medium_640.png","large_1024":"http://storage.cloud.appcelerator.com/P9mmtk4COHPiuvp1GF18IpnE8ydCbbRl/photos/e4/87/528c6a3f00de2c0b32001121/175d6f20_large_1024.png","original":"http://storage.cloud.appcelerator.com/P9mmtk4COHPiuvp1GF18IpnE8ydCbbRl/photos/e4/87/528c6a3f00de2c0b32001121/175d6f20_original.png"},"content_type":"image/png"});
	// AG.utils.openController(AG.mainTabGroup.activeTab,
		// 'photoDetail',
		// {
			// photoModel : cacheModel
		// }
	// );
// });


