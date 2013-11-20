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
		var urls = photo.get('urls');
		
		var profileUrl = 
			String.format("https://graph.facebook.com/%s/picture?width=%d&height=%d",
						photo.get('user').external_accounts[0].external_id,
						80,
						80);
		items.push({
			template : 'itemTemplate',
			photo : {
				image : urls.medium_640 || urls.original 
			},
			title :{
				text : photo.get('title'),
				value : photo.get('title')
			},
			userName:{
				text : photo.get('user').first_name
			},
			time : {
				text : AG.moment(photo.get('created_at')).fromNow()
			},
			profileImage : {
				image : profileUrl
			},
			properties :{
				itemId : photo.id
			},
		});
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
