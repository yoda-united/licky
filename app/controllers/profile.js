var args = arguments[0] || {}, user = args.user;


if (user) {
	Ti.API.info("[profile.js] another user");
} else {
	Ti.API.info("[profile.js] loggedInUser");
	user = AG.loggedInUser;
	if (!AG.isLogIn()) {
		alert("[profile.js] need login!");
	}
}

// TODO: 스타일로 빼고 싶은데..
$.photoListC.getView().top = 272.5;	// profileBanner + controlBar's height
$.photoListC.getView().setBubbleParent(false);

// 컨트롤바를 건드리면 리스트뷰가 꽉찬 화면이랑 프로필 베너가 다 보이는 화면이 전환되게 하는 로직 
$.controlBar.addEventListener('touchstart', function(e){
	var offset = $.mainContent.getContentOffset().y;
	if( offset === 0 ){
		$.mainContent.setContentOffset({y:212.5});
		$.mainContent.setScrollingEnabled(false);
	}else{
		$.mainContent.setContentOffset({y:0});
		$.mainContent.setScrollingEnabled(true);
	}
});
// 리스트뷰가 꽉찬 화면이랑 프로필 베너가 다 보이는 화면이랑 둘 중 하나만 보이는 페이지 느낌이 나도록 하는 로직.
$.mainContent.addEventListener('dragend', function(e){
	var offset = $.mainContent.getContentOffset().y;
	if( offset < 80 ){	// 80 is trigger offset
		$.mainContent.setContentOffset({y:0});
		$.mainContent.setScrollingEnabled(true);
	}else{
		$.mainContent.setContentOffset({y:212.5});
		$.mainContent.setScrollingEnabled(false);
	}
});
// 리스트뷰가 화면에 가득 찼을 때는 메인컨탠트뷰 스크롤을 금지 시킨다.
// $.mainContent.addEventListener('scrollend', function(e){
	// var offset = $.mainContent.getContentOffset().y;
	// if( offset === 0 ){
		// $.mainContent.setScrollingEnabled(true);
	// }else{
		// $.mainContent.setScrollingEnabled(false);
	// }
	// alert("se");
// });


$.settingDialog.addEventListener('click', function(e){
	// alert(e);
	if(e.index === 0){
		AG.settings.get('cloudSessionId') ? AG.loginController.logout() : AG.loginController.requireLogin();
	}
});
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
function loginChangeHandler() {
	// 최초에 이미 로그인 되어 있을 경우에 대한 처리
	if (AG.isLogIn()) {
		// $.resetClass($.loginBtn, 'afterLogin');
	} else {
		// $.resetClass($.loginBtn, 'beforeLogin');
	}
}
loginChangeHandler();

function showCamera() {
	AG.loginController.requireLogin(function() {
		Alloy.createController('cameraOveray', {
			collection : photoCol
		}).showCamera();
	});
}

exports.setProperties = function() {
	// alert(user);
	var fb_id = user.get('external_accounts')[0].external_id;
	$.name.text = user.get('first_name');
	$.profileImage.image = String.format("https://graph.facebook.com/%s/picture?width=%d&height=%d", fb_id, 140, 140);
	// $.profileBannerImage.image = String.format("https://graph.facebook.com/%s?fields=cover", user.get('external_accounts')[0].external_id);
	AG.facebook.requestWithGraphPath(fb_id, {fields: 'cover'} , "GET", function(e) {
		// alert(e);
		if(e.success){
			// alert(JSON.parse(e.result).cover.source);
			$.profileBannerImage.image = JSON.parse(e.result).cover.source;
		}
	});
	// 페이스북에서 정보가져와서 석세스 되면 셋팅하는 코드 쓸 차례 (커버 사진등 )
};

