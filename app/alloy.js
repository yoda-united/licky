if(ENV_PRODUCTION){
	var newrelic = require('ti.newrelic'); 
	newrelic.start("***REMOVED***");
}

//alias
var AG = Alloy.Globals;
AG.slimer = require("ti.cloud.slimer");

//extend library
AG.moment = require('momentExtend');
moment.lang(AG.currentLanguage);
_.str = require('underscore.string');
Titanium.UI.createMaskedImage;

AG.COLORS = require('colors');
AG.utils = require('utils');
AG.Cloud = require('ti.cloud');

if(ENV_DEV || ENV_TEST){
	AG.Cloud.debug = true;
	Ti.App.idleTimerDisabled = true;
}

// settings
Ti.Geolocation.purpose = L('geoPurpose');//'위치 기반 검색 제공 및 ';
AG.facebook = require('facebook');
AG.facebook.appid = Ti.App.Properties.getString("ti.facebook.appid");
AG.facebook.permissions = ["publish_stream","email"];

AG.currentLanguage = Ti.Locale.getCurrentLanguage();

AG.cameraInfo = {
	top : 44,
	width : 320,
	height: 256 // 1136/2 - 44 - 216 - 52
	// height : 180
};
AG.loginController =  Alloy.createController('login');
AG.notifyController = Alloy.createController('notifyView');

//singleton Models (static id)
AG.settings = Alloy.Models.instance('settings');
// AG.currentPosition = new Backbone.Model();

AG.loggedInUser = Alloy.Models.instance('loggedInUser');
AG.loggedInUser.fetch(); //주의! : properties 아답터를 사용하므로 동기 방식.
AG.isLogIn = function(){
	return !!AG.settings.get('cloudSessionId');
};

AG.settings.fetch({
	success: function(){
		if( AG.settings.get('cloudSessionId') ){
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
		if( !AG.settings.has("platformHeight") ){
			AG.settings.save("platformHeight", Ti.Platform.displayCaps.platformHeight);
		}	
		if( !AG.settings.has("postWithFacebook") ){
			AG.settings.save("postWithFacebook", true);
		}
		if( !AG.settings.has("deviceToken")  ){
			// push notification
			if( OS_IOS ){
				// Ti.Network.unregisterForPushNotifications();
				Ti.Network.registerForPushNotifications({
					types: [
						Ti.Network.NOTIFICATION_TYPE_BADGE,
						Ti.Network.NOTIFICATION_TYPE_ALERT,
						Ti.Network.NOTIFICATION_TYPE_SOUND
					],
					callback: function(e){
						// alert("data: "+JSON.stringify(e.data) +"\n"+e.inBackground);
						// 뱃지를 0으로 하는거를 무시하지 않으면 무한 반복 푸쉬 됨..
						if(  e.data.badge === 0 ){
							return;
						}
						AG.notifyController.push({
							pushEvent: e
						});
					},
					error: function(e){
						Ti.API.info('register for pushnotification error');
					},
					success: function(e){
						AG.settings.save("deviceToken", Ti.Network.getRemoteDeviceUUID() );
						AG.loginController.subscribePushChannel();
					}
				});
			}			
		}else{
			// 안해도 되는데..
			// AG.loginController.subscribePushChannel('broadcast');
		}
	}
});
AG.currentPosition = Alloy.Models.instance('currentPosition');
AG.currentPosition.update();

AG.setAppBadge = function(number){
	Ti.UI.iPhone.setAppBadge(number);
	if( AG.isLogIn ){
		// PushNotifications.reset_badge_get 이 아직 구현 안돼서..
		AG.Cloud.PushNotifications.notify({
			channel: "comment",	// shoulbe all exist channel 
			to_ids: AG.loggedInUser.get('id'),
			payload: {
			    "badge": number
			}
		}, function (e) {
		    if (e.success) {
		    	Ti.API.info("success");
		    } else {
		    	Ti.API.info("fail:"+JSON.stringify(e));
		    }
		});		
	}
};

var appMetaDebounce = _.debounce(function() {
	Alloy.createWidget('appMetaFromACS').fetch();
});

setTimeout(appMetaDebounce,3000);
Ti.App.addEventListener('resume', appMetaDebounce);






