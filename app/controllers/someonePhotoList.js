var args = arguments[0] || {};

var userModel = args.userModel || AG.loggedInUser;

var someoneId = userModel.get('id'); //loggedInUser일 경우때문에 get('id')사용

var photoCol = Alloy.createCollection('photo');

photoCol.defaultFetchData = {
	//order : "-created_at",
	where :{
		user_id: {'$in' : [someoneId]}
	}
};

$.listViewC.setCollection(photoCol);
$.listViewC.setTemplateControls([
	'photoItemTemplate'
]);

photoCol.fetch();

