exports.baseController = 'photoList';
var args = arguments[0] || {};
var currentWindow = $.photoList;
var photoCol = $.getCollection();

$.afterWindowOpened = function(){
	
};

function showOnlyLoginRequiredMessage(){
	$.section.setItems([]);
	$.listView.footerTitle = "친구들의 사진을 보려면 로그인이 필요합니다.";
};
showOnlyLoginRequiredMessage();



AG.settings.on('change:cloudSessionId',function(model, changedValue, options){
	/**
	 * facebook 친구
	 */
	if(changedValue){
		var friendIds = [];
		AG.Cloud.SocialIntegrations.searchFacebookFriends(function (e){
		    if (e.success) {
		        // alert('Success:\n' + 'Count: ' + e.users.length);
		        _.each(e.users,function(user){
		        	friendIds.push(user.id);
		        });
		        fetchOnlyFriendsPhoto(friendIds);
		    } else {
		        // alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
		    }
		});
	} else { //로그아웃시
		showOnlyLoginRequiredMessage();
	}
});

function fetchOnlyFriendsPhoto(userIds) {
	if(userIds.length){
		$.defaultFetchData = {
			where : {
				user_id: {'$in' : userIds},
				//order : "-updated_at"
			}
		};
		photoCol.fetch({
			data : $.defaultFetchData
		});
	}else{
		//TODO: 추천 방법과 관련되서는 더 고민 필요
		$.listView.footerTitle = "Bogoyo를 사용 중인 친구가 없습니다. 친구들에게 bogoyo 앱을 추천해보세요.";
	}
}