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
	$.termsLabel.attributedString = Ti.UI.iOS.createAttributedString({
		text : L('termsAndPrivacy'),
		attributes : [{
			type : Ti.UI.iOS.ATTRIBUTE_UNDERLINES_STYLE,
			value : Ti.UI.iOS.ATTRIBUTE_UNDERLINE_STYLE_SINGLE,
			range : [L('termsAndPrivacy').indexOf('이용약관'), '이용약관'.length]
		}, {
			type : Ti.UI.iOS.ATTRIBUTE_UNDERLINES_STYLE,
			value : Ti.UI.iOS.ATTRIBUTE_UNDERLINE_STYLE_SINGLE,
			range : [L('termsAndPrivacy').indexOf('개인정보 취급정책'), '개인정보 취급정책'.length]
		}]
	});
}

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
			type : 'facebook',
			token : token
		}, function(e) {
			Ti.API.info(e);
			if (e.success) {
				var user = e.users[0];
				AG.settings.save('cloudSessionId', AG.Cloud.sessionId);
				AG.loggedInUser.save(user);

				subscribePushChannel();

				//$.fbLogin.title = L("facebookConnect");
				currentWindow.close();

			} else {
				alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
				$.fbLogin.title = L("facebookConnect");
			}
		});
	} else {
	}
};

$.fbLogin.addEventListener('click', function(e) {
	$.fbLogin.title = L('facebookConnecting');

	if (OS_IOS) {
		AG.facebook.authorize({
			forceDialogAuth : false
		});
	} else {
		AG.Cloud.Users.login({
			login : 'admin',
			password : 'bogoyo'
		}, function(e) {
			if (e.success) {
				var user = e.users[0];

				AG.settings.save('cloudSessionId', AG.Cloud.sessionId);
				AG.loggedInUser.save(user);
				$.fbLogin.title = L("facebookConnect");
				currentWindow.close();
			} else {
				alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
				$.fbLogin.title = L("facebookConnect");
			}
		});
	}
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
	AG.loginController = Alloy.createController('login');
	$ = null;
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
	unsubscribePushChannel(['comment']);
	AG.Cloud.Users.logout(function(e) {
		if (e.success) {
			// AG.settings.unset('cloudSessionId',{silent:false});
			AG.settings.save('cloudSessionId', null);
			AG.loggedInUser.clearWithoutId();
			AG.loggedInUser.save();
			Ti.API.info(AG.loggedInUser.toJSON());
			AG.facebook.logout();
			alert(L('logoutMessage'));
			callback && callback();
		} else {
			alert("로그 아웃이 실패 했는데..\n다시 시도 해보실래요?;;");
		}
	});
};

var subscribePushChannel = function(args) {
	args = args || {};
	var channels = args.channels || ['broadcast', 'comment'];
	var params = {
		device_token : AG.settings.get('deviceToken'),
		type : OS_IOS ? "ios" : "android"
	};

	if (params.device_token) {
		_.each(channels, function(channel) {
			if (!AG.settings.get(channel + 'Subscribed') || args.force) {
				AG.Cloud.PushNotifications.subscribe(_.extend({
					channel : channel
				}, params), function(e) {
					if (e.success) {
						AG.settings.save(channel + 'Subscribed', true);
					} else {
					}
				});
			}
		});
	}
};
exports.subscribePushChannel = subscribePushChannel;

var unsubscribePushChannel = function(args) {
	args = args || {};
	var channels = args.channels || ['broadcast', 'comment'];
	var params = {
		device_token : AG.settings.get('deviceToken'),
		type : OS_IOS ? "ios" : "android"
	};

	_.each(channels, function(channel) {
		
		AG.Cloud.PushNotifications.unsubscribe(_.extend({
			channel : channel
		}, params), function(e) {
			if (e.success) {
				AG.settings.save(channel + 'Subscribed', false);
			} else {
			}
		});
	});
};
exports.unsubscribePushChannel = unsubscribePushChannel;

// 시스템 remote push 는 혀용했으나 subscribe 된 기록이 없을 경우 subscribe함
_.defer(function(){
	if(AG.isLogIn && AG.isLogIn() && Ti.Network.remoteNotificationsEnabled){
		subscribePushChannel({force:true}); //not force 
	}
});