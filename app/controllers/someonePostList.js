var args = arguments[0] || {};

var userModel = args.userModel || AG.loggedInUser;

var someoneId = userModel.get('id'); //loggedInUser일 경우때문에 get('id')사용

var postCol = Alloy.createCollection('post');


//init ui
var isMe = userModel.get('id') == AG.loggedInUser.get('id');

var postFetch;
if(!args.likedPostOnly){
	$.getView().title = isMe?L('myLicks'):String.format(L('someoneLicks'),userModel.get('first_name'));
	postCol.defaultFetchData = {
		order : "-created_at",
		show_user_like : true,
		per_page : 30,
		where :{
			user_id: {'$in' : [someoneId]}
		}
	};
}else{
	
	$.getView().title = isMe?L('myLikes'):String.format(L('someoneLikes'),userModel.get('first_name'));
	
	// like한 post만 fetch하기 위해 postCol의 변형
	postCol.defaultFetchData = {};
	postCol.originFetch = postCol.fetch;
	postCol.comparator = function(modelA, modelB) { //like 최근에 한 post가 상단에 나오도록 하기 위함
		if(this.likedIds){
			return _.indexOf(this.likedIds, modelA.id) - _.indexOf(this.likedIds, modelB.id); 
		}
		return 0; // equal
	};
	postCol.fetch = function(args){
		args = args || {};
		var likeCol = Alloy.createCollection('like');
		likeCol.fetch({
			data : {
				user_id : userModel.get('id'),
				likeable_type : 'Post',
				per_page : 1000,
				order : "-created_at",
				sel : { all : ["likeable_id"]}
			},
			success : function(col){
				if(col.length === 0){
					postCol.reset();					
					args.success && args.success(col);
					return;
				}
				postCol.likedIds = col.map(function(m){ return m.get('likeable_id'); });
				postCol.defaultFetchData = {
					per_page : 1000,
					where :{
						id: {'$in' : postCol.likedIds }
					},
					show_user_like : true
				};
				postCol.originFetch(args);
			},
			error : function(){
				args.error && args.error(); 
			}
		});
	};
}
$.getView().backButtonTitle = L('back');




$.listViewC.setCollection(postCol);
$.listViewC.setTemplateControls([
	'postItemTemplate'
]);

$.getView().addEventListener('focus', function(e) {
	this.removeEventListener('focus',arguments.callee);
	postCol.fetch({
		success: function(col){
			if(col.length === 0){
				$.listViewC.listView.footerView = Alloy.createController('noItemView',{
					iconText : args.likedPostOnly?'\uf1e0':'\uf164',
					labelText : args.likedPostOnly?'이거다 싶은 음식을 보면 별표를 눌러주세요.\n이 목록에 쌓입니다.':'아직 Licky로 먹은게 하나도 없네요..'						
				}).getView();
			}
		}
	});
});


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
