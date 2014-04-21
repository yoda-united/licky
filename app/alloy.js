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

//singleton Models (static id)
AG.settings = Alloy.Models.instance('settings');
// AG.currentPosition = new Backbone.Model();
AG.currentPosition = Alloy.Models.instance('currentPosition');
AG.currentPosition.update();
AG.settings.fetch({
	success: function(){
		if( !AG.settings.has("platformHeight") ){
			AG.settings.save("platformHeight", Ti.Platform.displayCaps.platformHeight);
		}	
		if( !AG.settings.has("postWithFacebook") ){
			AG.settings.save("postWithFacebook", true);
		}	
	}
});
AG.loggedInUser = Alloy.Models.instance('loggedInUser');
AG.loggedInUser.fetch(); //주의! : properties 아답터를 사용하므로 동기 방식.
AG.isLogIn = function(){
	return !!AG.settings.get('cloudSessionId');
};
AG.loginController =  Alloy.createController('login');
AG.notifyController = Alloy.createController('notifyView');
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
			var subscribePush = function(){
				if( AG.settings.get('cloudSessionId') ){
					AG.Cloud.PushNotifications.subscribe({
					    channel: 'comment',
					    type: 'ios',
					    device_token: Ti.Network.getRemoteDeviceUUID()
					}, function (e) {
					    if (e.success) {
					    	AG.settings.off('change:cloudSessionId', subscribePush );
					        // alert('Success subscribe\n' + JSON.stringify(e) );
					    } else {
					        // alert('Error subscribe:\n' + ((e.error && e.message) || JSON.stringify(e)));
					    }
					});
				}
			};
			
			if( AG.settings.get('cloudSessionId') ){
				subscribePush();
			}else{
				AG.settings.on('change:cloudSessionId', subscribePush );
			}
		}
	});
}

AG.Cloud.Chats.create({
	    to_ids: '52841ff87bf3190b300173ea,5345c10f891fdf43ba114cec',
	    message: '{"user":{"id":"528805007bf3190b30023701","first_name":"yo","last_name":"lee","created_at":"2013-11-16T23:51:28+0000","updated_at":"2014-04-11T09:06:54+0000","external_accounts":[{"external_id":"100001903675798","external_type":"facebook","token":"CAACuXxCk7vUBAFw4M7Rk3eXBjeQ1gZB06lQX82gxwpk87NZBgcEIiZCm9dweZBRiFtp2H6TbfFLxv1s2Vgx48nSMDKIQNZAFd4WuKEvjtPz2MGp8JnSDU1U7JZCmtQ9qsjFrHCnSE2IaM6rw5A39dKPNuZA3kXdGdNT4U1f2gUaMELZBm1z9jWkOUVUNiEZCdYrcZD"}],"confirmed_at":"2013-11-16T23:51:28+0000","admin":"false","stats":{"photos":{"total_count":0},"storage":{"used":0}}},"photo_urls":{"thumb_100":"http://storage.cloud.appcelerator.com/P9mmtk4COHPiuvp1GF18IpnE8ydCbbRl/photos/09/18/533bc4b90f4fb50bae003585/15fcaaa0_thumb_100.jpeg","medium_320":"http://storage.cloud.appcelerator.com/P9mmtk4COHPiuvp1GF18IpnE8ydCbbRl/photos/09/18/533bc4b90f4fb50bae003585/15fcaaa0_medium_320.jpeg","original":"http://storage.cloud.appcelerator.com/P9mmtk4COHPiuvp1GF18IpnE8ydCbbRl/photos/09/18/533bc4b90f4fb50bae003585/15fcaaa0_original.jpeg"},"post_user":{"id":"52841ff87bf3190b300173ea","first_name":"jongeun","last_name":"lee","created_at":"2013-11-14T00:57:28+0000","updated_at":"2014-04-09T22:53:24+0000","external_accounts":[{"external_id":"1417938346","external_type":"facebook"}],"confirmed_at":"2013-11-14T00:57:28+0000","admin":"true","stats":{"photos":{"total_count":0},"storage":{"used":0}},"custom_fields":{"betaStatus":"sent","beta_test_request":true,"beta_status":""}},"badge":"+1","sound":"default","alert":"yo: wowowo","post_id":"533bc4b90f4fb50bae003583"}',
	    payload: '{"alert":"222"}',
		channel : 'comment',
		custom_fields: {
			wow : 'wowowow'
		}
	}, function (e) {
		console.log(e);
		alert(e);
}
);