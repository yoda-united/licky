var currentWindow = $.photoList;

function showCamera(){
	AG.loginController.requireLogin(function(){
			Alloy.createController('cameraOveray').showCamera();
	});
}

var photoCol = Alloy.createCollection('photo');
photoCol.on('reset',function(col){
	var items = []; 
	col.each(function(photo){
		Ti.API.info(photo.attributes);
		var urls = photo.get('urls');
		items.push({
			template : 'itemTemplate',
			photo : {
				image : urls.medium_640 || urls.original 
			},
			title :{
				text : photo.get('title')
			},
			properties :{
				itemId : photo.id,
				height : 70
			},
		});
	});
	$.section.setItems(items);
});
photoCol.fetch();
