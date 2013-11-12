var currentWindow = $.getView();
var fbHandler = function(e){
	// alert(e);
	if (e.success) {
        var token = this.accessToken;
        Ti.API.info('Logged in ' + token);
        
        $.fbLogin.title = "연결중..";
        Cloud.SocialIntegrations.externalAccountLogin({
		    type: 'facebook',
		    token: token
		}, function (e) {
		    if (e.success) {
		        var user = e.users[0];
		        Ti.App.Properties.setString('cloudSessionId', Cloud.sessionId);
		        // alert(String.format('%s님 반갑습니다.',user.last_name+user.first_name));
		        Alloy.Collections.instance('user').reset([]); //reset
		        
		        var loginUser = Alloy.Models.instance('user');
		        loginUser.set(user);
		        loginUser.save();

		        subscribePushChannel(function(){
		        		currentWindow.close();
		        });
		        //
		    } else {
		        alert('Error:\n' +
		            ((e.error && e.message) || JSON.stringify(e)));
		     	   $.fbLogin.title = "Connect Facebook";
		    }
		});
    }
};

$.fbLogin.addEventListener('click', function(e) {
	AG.facebook.authorize();
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
		Cloud.PushNotifications.subscribe({
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
	Cloud.sessionId = AG.settings.get('cloudSessionId');
	Cloud.Users.showMe(function(e) {
		if (e.success) {
			var user = e.users[0];
			AG.settings.save({
				loggedInUser : user
			});
		} else {
			alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
		}
	}); 
}

exports.requireLogin = function(args){
	args = args || {};

	var callback = args.callback; 
	if(AG.settings.get('cloudSessionId')){
		callback && callback();
	}else{
		$.getView().open();
	}
};

exports.logout = function(callback){
	
};