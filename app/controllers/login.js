var currentWindow = $.login;

$.closeBtn.addEventListener('click', function(e) {
	currentWindow.close();
});

$.termsLabel.addEventListener('click', function(e) {
	var win = Ti.UI.createWindow();
	win.add(Ti.UI.createWebView({
		url : (ENV_DEV || ENV_TEST) ? 'http://192.168.0.2:8080/terms.html' : 'http://www.licky.co/terms.html'
	}));
	currentWindow.openWindow(win);
});

if (OS_IOS) {
	// $.termsLabel.attributedString = Ti.UI.iOS.createAttributedString({
	// 	text : L('termsAndPrivacy'),
	// 	attributes : [{
	// 		type : Ti.UI.iOS.ATTRIBUTE_UNDERLINES_STYLE,
	// 		value : Ti.UI.iOS.ATTRIBUTE_UNDERLINE_STYLE_SINGLE,
	// 		range : [L('termsAndPrivacy').indexOf('이용약관'), '이용약관'.length]
	// 	}, {
	// 		type : Ti.UI.iOS.ATTRIBUTE_UNDERLINES_STYLE,
	// 		value : Ti.UI.iOS.ATTRIBUTE_UNDERLINE_STYLE_SINGLE,
	// 		range : [L('termsAndPrivacy').indexOf('개인정보 취급정책'), '개인정보 취급정책'.length]
	// 	}]
	// });
}
$.termsLabel.html = L('termsAndPrivacy');

// currentWindow.addEventListener('swipe', function(e){
// if( e.direction === 'down'){
// currentWindow.close();
// }
// });

var fbHandler = function(e) {
	Ti.API.info("fb: " + JSON.stringify(e));
	if (e.type == 'login') {
		var token = this.accessToken;
		Ti.API.info('Logged in ' + token);
		AG.Cloud.SocialIntegrations.externalAccountLogin({
			id : e.uid,
			type : 'facebook',
			token : token
		}, function(e) {
			Ti.API.info(e);
			if (e.success) {
				var user = e.users[0];
				AG.settings.save('cloudSessionId', AG.Cloud.sessionId);
				AG.loggedInUser.save(user);

				currentWindow.close();
				$.fbLogin.title = L("signInWithFacebook");

			} else {
				//alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
				alert(L('errorExternalAccountLogin'));
				$.fbLogin.title = L("signInWithFacebook");
			}
		});
	} else {
	}
};

$.fbLogin.addEventListener('click', function(e) {
	$.fbLogin.title = L('facebookConnecting');
	AG.facebook.authorize();
});

// $.emailBtn.addEventListener('click', function(e) {
// alert('아직 안되지롱~요..\nFacebook으로 해주세요.^^');
// });

// currentWindow.addEventListener('open', function(e) {
AG.facebook.addEventListener('login', fbHandler);
// });

// currentWindow.addEventListener('close', function(e) {
AG.facebook.addEventListener('logout', fbHandler);
// });

// Navigation Window를 써서 그런지 window 재사용시 화면의 일부가 안보이는 문제 임시 해결
currentWindow.addEventListener('close', function(e) {
	// AG.loginController = Alloy.createController('login');
	// $ = null;
});

exports.requireLogin = function(args) {
	args = args || {};
	var success = args.success, cancel = args.cancel;
	if (AG.settings.get('cloudSessionId')) {
		success && success();
	} else {
		//window 닫힐때 로그인 성공했으면 callback 실행
		$.loginGuidance.text = args.message || L('defaultLoginMessage');
		currentWindow.addEventListener('close', function(e) {
			if (AG.isLogIn()) {
				success && success();
			} else {
				cancel && cancel();
			}
			currentWindow.removeEventListener('close', arguments.callee);
		});
		currentWindow.open({
		});
	}
};

exports.logout = function(callback) {
	AG.Cloud.Users.logout(function(e) {
		if (e.success) {
			// AG.settings.unset('cloudSessionId',{silent:false});
			AG.settings.save({'cloudSessionId': null},{
				wait: true
			});
			AG.loggedInUser.clearWithoutId();
			// AG.loggedInUser.save();
			AG.facebook.logout();
			alert(L('logoutMessage'));
			callback && callback();
		} else {
			alert(L('failToLogout'));
		}
	});
};
