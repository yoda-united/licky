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
		items.push(photo.doDefaultTransform());
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