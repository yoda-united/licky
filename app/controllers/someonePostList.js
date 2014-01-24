var args = arguments[0] || {};

var userModel = args.userModel || AG.loggedInUser;

var someoneId = userModel.get('id'); //loggedInUser일 경우때문에 get('id')사용

var postCol = Alloy.createCollection('post');


//init ui
var isMe = userModel.get('id') == AG.loggedInUser.get('id');
$.getView().title = isMe?L('myLicks'):String.format(L('someoneLicks'),userModel.get('first_name'));
$.getView().backButtonTitle = L('back');


postCol.defaultFetchData = {
	//order : "-created_at",
	where :{
		user_id: {'$in' : [someoneId]}
	}
};

$.listViewC.setCollection(postCol);
$.listViewC.setTemplateControls([
	'postItemTemplate'
]);

postCol.fetch();

$.listViewC.on('itemclick', function(e) {
	if (e.model) {
		if (e.bindId == "profileImage") {
			AG.utils.openController(AG.mainTabGroup.activeTab, 'profile', {
				//user가 backbone 모델 형태가 아니므로 model로 만들어서 넘겨준다.
				userModel : Alloy.createModel('user',e.model.get('user'))
			});
		} else {
			AG.utils.openController(AG.mainTabGroup.activeTab, 'postDetail', {
				postModel : e.model //clicked Model
			});
		}
	}
}); 
