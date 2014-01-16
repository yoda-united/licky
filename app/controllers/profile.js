var args = arguments[0] || {}, user = args.user;

if (user) {
	// 다른 사람 프로필
	Ti.API.info("[profile.js] another user");
} else {
	// "Me" 탭  
	Ti.API.info("[profile.js] loggedInUser");
	user = AG.loggedInUser;
	
	// 로그인 하지 않았을 때 
	if (!AG.isLogIn()) {
		// alert("[profile.js] need login!");
	}
}

$.getView().addEventListener('focus', function(e) {
	$.setProperties();
});

$.mainContent.addEventListener('scroll', function(e){
	// Ti.API.info("y:"+e.y);
	
	// $.profileBannerImage.setHeight( 212.5 - e.y);
	$.profileBannerImage.animate({
		duration: 5,
		height: 212.5 - e.y});
	// $.controlBar.setTop(182.5 - e.y);
	$.controlBar.animate({
		duration: 5,
		top: 182.5 - e.y});
});

$.foodRow.addEventListener('click', function(e) {
	AG.utils.openController(AG.mainTabGroup.activeTab, "photoList", {
		// photoModel : photoCol.get(e.itemId) //clicked Model
	});
});

$.settingDialog.addEventListener('click', function(e) {
	// alert(e);
	if (e.index === 0) {
		// AG.settings.get('cloudSessionId') ? AG.loginController.logout() : AG.loginController.requireLogin();
		AG.loginController.logout();
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
	if(false){
		// 다른 사용자의 프로필일 경우 
		return;
	}
	
	// 최초에 이미 로그인 되어 있을 경우에 대한 처리
	if (AG.isLogIn()) {
		// $.resetClass($.loginBtn, 'afterLogin');
		$.menuTable.setVisible(true);
		$.name.setVisible(true);
		$.wireForBtnImg.setVisible(true);
		$.profileSettingBtn.setVisible(true);
	} else {
		// $.resetClass($.loginBtn, 'beforeLogin');
		$.menuTable.setVisible(false);
		$.name.setVisible(false);
		$.wireForBtnImg.setVisible(false);
		$.profileSettingBtn.setVisible(false);
		
		$.profileBannerImage.setImage(null);
		$.profileImage.setImage( $.profileImage.getDefaultImage() );
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
	if (!AG.isLogIn()) {
		return;
	}

	var fb_id = user.get('external_accounts')[0].external_id;
	$.name.text = user.get('first_name');
	$.profileImage.image = String.format("https://graph.facebook.com/%s/picture?width=%d&height=%d", fb_id, 140, 140);
	AG.facebook.requestWithGraphPath(fb_id, {
		fields : 'cover'
	}, "GET", function(e) {
		// alert(e);
		if (e.success) {
			// alert(JSON.parse(e.result).cover.source);
			$.profileBannerImage.image = JSON.parse(e.result).cover.source;
		}
	});
};

