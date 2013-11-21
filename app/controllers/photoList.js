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
		_.each(items, function(item){
			if(e.itemId==item.properties.itemId){
				item.template = 'selectedItemTemplate';
			}else{
				item.template = 'itemTemplate';
			}
		});
		$.section.setItems(items);
	}
});

photoCol.fetch();