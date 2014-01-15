
/**
 * Models
 */
var photoCol = Alloy.createCollection('photo');
photoCol.defaultFetchData = {
	order : "-created_at"
};

var friendPhotoCol = Alloy.createCollection('photo');


$.listViewC.setCollection(photoCol);


$.listViewC.setTemplateControls([
	'photoItemTemplate'
]);

$.listViewC.on('itemclick',function(e){
	if(e.model){
		AG.utils.openController(AG.mainTabGroup.activeTab,
			'photoDetail',
			{
				photoModel : e.model //clicked Model
			}
		);
	}
});
photoCol.fetch();


AG.settings.on('change:cloudSessionId',function(model, changedValue, options){
	/**
	 * facebook 친구
	 */
	if(changedValue){
		searchFacebookFriends();
	} else { //로그아웃시
		if($.tBar.index==1){
			$.tBar.setIndex(0);
			$.listViewC.setCollection(photoCol);
		}
	}
});

//init UI

//최초 실행시 tabbedBar가 안보이도록 함
$.listViewC.listView.visible=false;
$.getView().addEventListener('open', function(e) {
	$.listViewC.listView.contentTopOffset = -14;
	$.listViewC.listView.visible=true;
});

function searchFacebookFriends(){
	if(AG.isLogIn()){
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
	}else{
		showOnlyLoginRequiredMessage();
	}
}

function fetchOnlyFriendsPhoto(userIds) {
	if(userIds && userIds.length){
		friendPhotoCol.defaultFetchData = {
			where : {
				user_id: {'$in' : userIds}
			},
			order : "-created_at"
		};
		friendPhotoCol.fetch({
			error:function(){
				alert('error');
			}
		});
	}else{
		//TODO: 추천 방법과 관련되서는 더 고민 필요
		$.listViewC.listView.footerTitle = "Bogoyo를 사용 중인 친구가 없습니다. 친구들에게 bogoyo 앱을 추천해보세요.";
	}
}

/**
 * UI
 */

$.listHeaderView.parent.remove($.listHeaderView);
$.listViewC.topSection.headerView = $.listHeaderView;

$.tBar.addEventListener('click', function(e) {
	switch(e.index){
		case 0:
			$.listViewC.setCollection(photoCol);
			photoCol.trigger('reset',photoCol);
		break;
		case 1:
			AG.loginController.requireLogin({
				success : function(){
					$.listViewC.setCollection(friendPhotoCol);
					if(friendPhotoCol.length){
						friendPhotoCol.trigger('reset',friendPhotoCol);
					}
					searchFacebookFriends();
				},
				cancel : function(){
					$.tBar.setIndex(0);
				},
				message : L('friendsPhotoNeedsLogin')
			});
			
		break;
	}
});



/**
 * 
 */
function showCamera(){
	AG.loginController.requireLogin({
		success : function(){
			Alloy.createController('cameraOveray',{
				collection : photoCol
			}).showCamera();
		},
		message : L('cameraNeedsLogin')
	});
}

Titanium.Geolocation.getCurrentPosition(function(e){
	if (!e.success || e.error)
	{
		// currentLocation.text = 'error: ' + JSON.stringify(e.error);
		Ti.API.info("Code translation: "+translateErrorCode(e.code));
		alert('error ' + JSON.stringify(e.error));
		return;
	}
	AG.currentPosition.set(e.coords);	
	//photoCol.trigger('reset',photoCol);
});