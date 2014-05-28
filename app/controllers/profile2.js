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

// 해당 사용자가 작성한 post 수 확인 
// 주의!!!!!! loggedIn User로 인해 get('id') 함수로 id를 가져와야함)
if(userModel.get('id')){  // !!!
	var postCol = Alloy.createCollection('post');
	postCol.fetch({
		data : {
			per_page : 1,
			where :{
				user_id: {'$in' : [userModel.get('id')]} // !!!
			},
		},
		success : function(col){
			$.section.items = [
				{
					template : 'titleAndCount',
					title : {
						text : isMe?L('myLicks'):String.format(L('someoneLicks'),userModel.get('first_name'))
					},
					count : {
						text : col.meta.total_results
					},
					properties : {
						accessoryType: Ti.UI.LIST_ACCESSORY_TYPE_DISCLOSURE,
						selectionStyle : Titanium.UI.iPhone.ListViewCellSelectionStyle.GRAY
					}
				}
			];
		}
	});
}


// title & label 변경
var isMe = userModel.get('id') == AG.loggedInUser.get('id');
$.getView().title = isMe?L('me'):userModel.get('first_name');
// $.foodRowLabel.text = isMe?L('myLicks'):String.format(L('someoneLicks'),userModel.get('first_name'));
// $.contactUsBtn.visible = isMe;

$.getView().addEventListener('focus', function(e) {
	$.setProperties();
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

function loginChangeHandler(changedValue) {
	if(changedValue && !userModel.get('id')){
		userModel = AG.loggedInUser;
	}
	
	// 최초에 이미 로그인 되어 있을 경우에 대한 처리
	if (AG.isLogIn() || userModel.get('id')) {
		// $.resetClass($.loginBtn, 'afterLogin');
		// $.menuTable.setVisible(true);
		$.name.setVisible(true);
		
	} else {
		// $.resetClass($.loginBtn, 'beforeLogin');
		// $.menuTable.setVisible(false);
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
				//$.profileBannerImage.image = resultObj.cover.source;
				// $.listView.addParallaxWithImage(resultObj.cover.source, 220);
				// $.listView.addParallaxWithView($.headerView, 220);
			}
		}
	});
};

	// $.listView.addParallaxWithView($.headerView, 260);
	// $.listView.setSectionHeaderInset(-260);
	
var NAVBAR_HEIGHT = 50;
var PARALLAX_HEADER_HEIGHT = 350;

var headerView = Ti.UI.createView({
    width : Ti.UI.FILL,
    height : PARALLAX_HEADER_HEIGHT,
    backgroundColor : 'red'
});

var view1 = Ti.UI.createLabel({width : '150dp', height : '150dp', backgroundColor : '#ffdddd', text:'Swipe Me right'});
var view2 = Ti.UI.createLabel({width : '150dp', height : '150dp',backgroundColor : '#ddffdd', text:'Swipe Me left'});

var scrollableView = Ti.UI.createScrollableView({
    width : Ti.UI.FILL,
    height : '150dp',
    views : [view1, view2]
});

headerView.add(scrollableView);

function onListViewPostlayout(e) {
    // attach the parallax header
    $.listView.addParallaxWithImage('http://cfile24.uf.tistory.com/image/1720E7364F4705EC0A3291', PARALLAX_HEADER_HEIGHT);
    $.listView.addParallaxWithView(headerView, PARALLAX_HEADER_HEIGHT);
    $.listView.setSectionHeaderInset(-PARALLAX_HEADER_HEIGHT + NAVBAR_HEIGHT);
    $.listView.scrollToItem(0, 0);
}
$.getView().addEventListener('open',onListViewPostlayout);

