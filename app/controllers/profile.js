var args = arguments[0] || {}, userModel = args.userModel;

if (userModel) {
	// 다른 사람 프로필
	Ti.API.info("[profile.js] another user");
} else if(AG.isLogIn()){
	Ti.API.info("[profile.js] loggedInUser");
	userModel = AG.loggedInUser;
} else{
	//에러 방지 차원에서 빈모델 생성
	userModel = Alloy.createModel('user');
}


// title & label 변경
var isMe = userModel.get('id') == AG.loggedInUser.get('id');
$.profile.title = isMe?L('me'):userModel.get('first_name');
$.foodRow.title = isMe?L('myLicks'):String.format(L('someoneLicks'),userModel.get('first_name'));

$.getView().addEventListener('focus', function(e) {
	$.setProperties();
});

$.mainContent.addEventListener('scroll', _.throttle(function(e){
	// $.profileBannerImage.setHeight( 212.5 - e.y);
	$.profileBannerImage.animate({
		duration: 15,
		height: 212.5 - e.y});
	// $.controlBar.animate({
		// duration: 10,
		// top: 182.5 - e.y});
}, 10));

$.foodRow.addEventListener('click', function(e) {
	AG.utils.openController(AG.mainTabGroup.activeTab, "someonePostList", {
		userModel : userModel
	});
});


$.settingDialog.addEventListener('click', _.throttle(function(e) {
	if (e.index === 0) {
		// AG.settings.get('cloudSessionId') ? AG.loginController.logout() : AG.loginController.requireLogin();
		AG.loginController.logout(function(e){
			AG.mainTabGroup.setActiveTab(0);
		});
	}
},1000));
$.profileSettingBtn.addEventListener('click', function(e) {
	$.settingDialog.show();
});

//로그인 상태 변경시
AG.settings.on('change:cloudSessionId', loginChangeHandler);

//로그인된 사용자 모델(local에 저장한 properties model) 변경시
AG.loggedInUser.on('change', function(model) {

});

// $.loginBtn.addEventListener('click', function(e) {
	// AG.settings.get('cloudSessionId') ? AG.loginController.logout() : AG.loginController.requireLogin();
// });
function loginChangeHandler(changedValue) {
	if(changedValue && !userModel.get('id')){
		userModel = AG.loggedInUser;
	}
	
	// 최초에 이미 로그인 되어 있을 경우에 대한 처리
	if (AG.isLogIn() || userModel.get('id')) {
		// $.resetClass($.loginBtn, 'afterLogin');
		$.menuTable.setVisible(true);
		$.name.setVisible(true);
		
	} else {
		// $.resetClass($.loginBtn, 'beforeLogin');
		$.menuTable.setVisible(false);
		$.name.setVisible(false);
		
		$.profileBannerImage.setImage(null);
		$.profileImage.setImage( $.profileImage.getDefaultImage() );
	}
	
	isMe = userModel.get('id') == AG.loggedInUser.get('id');
	$.wireForBtnImg.visible = isMe;
	$.profileSettingBtn.visible = isMe;
}
loginChangeHandler();

exports.setProperties = function() {
	if (!userModel.get('id')) {
		return;
	}

	var fb_id = userModel.get('external_accounts')[0].external_id;
	$.name.text = userModel.get('first_name');
	$.profileImage.image = String.format("https://graph.facebook.com/%s/picture?width=%d&height=%d", fb_id, 140, 140);
	AG.facebook.requestWithGraphPath(fb_id, {
		fields : 'cover'
	}, "GET", function(e) {
		if (e.success) {
			var resultObj = JSON.parse(e.result);
			if(resultObj.cover){
				$.profileBannerImage.image = resultObj.cover.source;
			}
		}
	});
};

