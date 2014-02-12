
	
var newrelic = require('ti.newrelic'); 
newrelic.start("***REMOVED***");




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
	height : 180
};

//singleton Models (static id)
AG.settings = Alloy.Models.instance('settings');
AG.currentPosition = new Backbone.Model();
AG.settings.fetch({
	success: function(){
		if( !AG.settings.has("platformHeight") ){
			AG.settings.save("platformHeight", Ti.Platform.displayCaps.platformHeight);
		}	
	}
});
AG.loggedInUser = Alloy.Models.instance('loggedInUser');
AG.loggedInUser.fetch(); //주의! : properties 아답터를 사용하므로 동기 방식.
AG.isLogIn = function(){
	return !!AG.settings.get('cloudSessionId');
};
AG.loginController =  Alloy.createController('login');


setTimeout(function(){
	var appMetaWidget = Alloy.createWidget('appMetaFromACS');
	appMetaWidget.updateAppMeta({
		success: function(data){
			Ti.API.info(data);
			Ti.API.info(data);
		}
	});
},10000);


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
			alert("push " + e.data + ", " + e.inBackground );
			// var pushData = e.data;
			// for(key in pushData){
				// alert("key: " + key + "\ndata:" + pushData[key]);
			// }
			// e.data.aps : object
			
			// e.data.alert: hi hehe
			// e.data.badge: 7
			// e.data.sound: 
			
			// e.data.aps.alert: asdf
			// e.data.aps.badge: 1
			// e.data.aps.sound: default
		},
		error: function(e){
			alert("error");
			// alert("error " + e.code + ", " + e.error );
		},
		success: function(e){
			alert("Ti.Network.registerForPushNotifications() success!" + Ti.Network.getRemoteDeviceUUID() );
			// return;
			
			var subscribePush = function(){
					alert("sub!@@"+AG.settings.get('cloudSessionId'));
				if( AG.settings.get('cloudSessionId') ){
					alert("haha");
					AG.Cloud.PushNotifications.subscribe({
					    channel: 'comment',
					    type: 'ios',
					    device_token: Ti.Network.getRemoteDeviceUUID()
					}, function (e) {
					    if (e.success) {
					    	AG.settings.off('change:cloudSessionId', subscribePush );
					        alert('Success subscribe\n' + JSON.stringify(e) );
					    } else {
					        alert('Error subscribe:\n' + ((e.error && e.message) || JSON.stringify(e)));
					    }
					});
				}
			};
			
			if( AG.settings.get('cloudSessionId') ){
				alert("로긴된 상태 ");
				subscribePush();
			}else{
				alert("로긴 전, 이벤트 들록 ");
				AG.settings.on('change:cloudSessionId', subscribePush );
			}
		}
	});
}

