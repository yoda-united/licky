
	
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
			Ti.UI.iPhone.setAppBadge(0);
			// AG.Cloud.PushNotifications.reset_badge_get({ 아직 구현 안돼서..
			AG.Cloud.PushNotifications.notify({
				channel: "comment",	// shoulbe all exist channel 
				to_ids: AG.loggedInUser.get('id'),
				payload: {
				    "badge": 0
				}
			}, function (e) {
			    if (e.success) {
			    	Ti.API.info("success");
			    } else {
			    	Ti.API.info("fail:"+JSON.stringify(e));
			    }
			});
		},
		error: function(e){
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

