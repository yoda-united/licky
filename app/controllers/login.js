var currentWindow = $.login;

$.closeBtn.addEventListener('click', function(e) {
	currentWindow.close();
});
// currentWindow.addEventListener('swipe', function(e){
	// if( e.direction === 'down'){
		// currentWindow.close();
	// }
// });


var fbHandler = function(e){
	Ti.API.info("fb: "+ JSON.stringify(e));
	if (e.type == 'login') {
        var token = this.accessToken;
        Ti.API.info('Logged in ' + token);
        AG.Cloud.SocialIntegrations.externalAccountLogin({
		    type: 'facebook',
		    token: token
		}, function (e) {
			Ti.API.info(e);
		    if (e.success) {
		        var user = e.users[0];
		        AG.settings.save('cloudSessionId', AG.Cloud.sessionId);
		        AG.loggedInUser.save(user);
		        
		        subscribePushChannel('comment');
		        
				$.fbLogin.title = L("facebookConnect");
				currentWindow.close();
				
		    } else {
		        alert('Error:\n' +
		            ((e.error && e.message) || JSON.stringify(e)));
		     	$.fbLogin.title = L("facebookConnect");
		    }
		});
    }else{
    }
};

$.fbLogin.addEventListener('click', function(e) {
	$.fbLogin.title = L('facebookConnecting');
	
	if(OS_IOS){
		AG.facebook.authorize({
			forceDialogAuth : false
		});
	}else{
		AG.Cloud.Users.login({
		    login: 'admin',
		    password: 'bogoyo'
		}, function (e) {
		    if (e.success) {
		        var user = e.users[0];
		        
		        AG.settings.save('cloudSessionId', AG.Cloud.sessionId);
		        AG.loggedInUser.save(user);
				$.fbLogin.title = L("facebookConnect");
				currentWindow.close();
		    } else {
		        alert('Error:\n' +
		            ((e.error && e.message) || JSON.stringify(e)));
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
	


exports.requireLogin = function(args){
	args = args || {};
	var success = args.success,
		cancel = args.cancel;
	if(AG.settings.get('cloudSessionId')){
		success && success();
	}else{
		//window 닫힐때 로그인 성공했으면 callback 실행
		$.loginGuidance.text = args.message || L('defaultLoginMessage');
		currentWindow.addEventListener('close', function(e) {
			if(AG.isLogIn()){
				success && success();
			}else{
				cancel && cancel();
			}
			currentWindow.removeEventListener('close', arguments.callee);
		});
		currentWindow.open({
		});
	}
};

exports.logout = function(callback){
	unsubscribePushChannel('comment');
	AG.Cloud.Users.logout(function(e) {
		if (e.success) {
			// AG.settings.unset('cloudSessionId',{silent:false});
			AG.settings.save('cloudSessionId',null);
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

var subscribePushChannel = function(channel){
	var params = {
		device_token: AG.settings.get('deviceToken'),
		type: OS_IOS?"ios":"android"
	};
	if( !AG.isLogIn() || channel == 'broadcast' ){
		params.channel = 'broadcast';
		AG.Cloud.PushNotifications.subscribeToken(params, function(e) {
			if (e.success) {
			} else {
			}
		}); 
	}else{
		params.channel = channel || 'comment';
		AG.Cloud.PushNotifications.subscribe(params, function (e) {
		    if (e.success) {
		        // alert('Success subscribe\n' + JSON.stringify(e) );
		    } else {
		        // alert('Error subscribe:\n' + ((e.error && e.message) || JSON.stringify(e)));
		    }
		});
	}
};
exports.subscribePushChannel = subscribePushChannel;

var unsubscribePushChannel = function(channel){
	var params = {
		device_token: AG.settings.get('deviceToken'),
		type: OS_IOS?"ios":"android"
	};
	if( !AG.isLogIn() || channel == 'broadcast' ){
		params.channel = 'broadcast';
		AG.Cloud.PushNotifications.unsubscribeToken(params, function(e) {
			if (e.success) {
			} else {
			}
		}); 
	}else{
		params.channel = channel || 'comment';
		AG.Cloud.PushNotifications.unsubscribe(params, function (e) {
		    if (e.success) {
		    } else {
		    }
		});
	}
};
exports.unsubscribePushChannel = unsubscribePushChannel;

