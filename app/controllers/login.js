var currentWindow = $.login;

var fbHandler = function(e){
	Ti.API.info("fb: "+ JSON.stringify(e));
	if (e.success) {
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
		        
				$.fbLogin.title = L("facebookConnect");
				currentWindow.close();
				
				// 푸쉬는 현재 미구현
		        // subscribePushChannel(function(){
		        		// currentWindow.close();
		        // });
		    } else {
		        alert('Error:\n' +
		            ((e.error && e.message) || JSON.stringify(e)));
		     	$.fbLogin.title = L("facebookConnect");
		    }
		});
    }
};

$.closeBtn.addEventListener('click', function(e) {
	currentWindow.close();
});

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
				
				// 푸쉬는 현재 미구현
		        // subscribePushChannel(function(){
		        		// currentWindow.close();
		        // });
		    } else {
		        alert('Error:\n' +
		            ((e.error && e.message) || JSON.stringify(e)));
		     	$.fbLogin.title = L("facebookConnect");
		    }
		});
	}
});

$.emailBtn.addEventListener('click', function(e) {
	alert('아직 안되지롱~요..\nFacebook으로 해주세요.^^');
});

currentWindow.addEventListener('open', function(e) {
	AG.facebook.addEventListener('login', fbHandler);
});


currentWindow.addEventListener('close', function(e) {
	AG.facebook.addEventListener('logout', fbHandler);
});
	
function subscribePushChannel(callback){
	var token = Ti.App.Properties.getString('deviceToken');
	if(token){
		AG.Cloud.PushNotifications.subscribe({
		    channel: 'quest',
		    device_token: token,
		    type: 'gcm'
		}, function (e) {
		    if (e.success) {
		        alert('첫번째 미션 회원가입 및 로그인 성공하셨습니다. 당첨 및 추가 이벤트는 푸쉬 알림으로 알려드리니 귀(?) 기울여 주세요.');
		        callback && callback();
		    } else {
		        alert('ACS PUSH Error:\n' + JSON.stringify(e));
		        $.fbLogin.title = "Connect Facebook";
		    }
		});
	}else{
		callback && callback();
	}
}

//최초 복구
if(AG.settings.get('cloudSessionId')){
	AG.Cloud.sessionId = AG.settings.get('cloudSessionId');
	AG.Cloud.Users.showMe(function(e) {
		if (e.success) {
			var user = e.users[0];
			AG.loggedInUser.save(user);
		} else {
			alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
		}
	}); 
}

exports.requireLogin = function(args){
	args = args || {};
	var success = args.success,
		cancel = args.cancel;
	if(AG.settings.get('cloudSessionId')){
		success && success();
	}else{
		//window 닫힐때 로그인 성공했으면 callback 실행
		currentWindow.addEventListener('close', function(e) {
			if(AG.settings.get('cloudSessionId')){
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
	AG.Cloud.Users.logout(function(e) {
		if (e.success) {
			// AG.settings.unset('cloudSessionId',{silent:false});
			AG.settings.save('cloudSessionId',null);
			AG.loggedInUser.clear();
			AG.loggedInUser.save();
			AG.facebook.logout();
		} else {
			alert("로그 아웃이 실패 했는데..\n다시 시도 해보실래요?;;");
		}
	});
};