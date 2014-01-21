var newrelic = require('ti.newrelic'); 
newrelic.start("***REMOVED***");

//alias
var AG = Alloy.Globals;

//extend library
_.str = require('underscore.string');
AG.moment = require('momentExtend');
moment.lang(AG.currentLanguage);
Titanium.UI.createMaskedImage;

AG.COLORS = require('colors');
AG.utils = require('utils');
AG.Cloud = require('ti.cloud');

if(ENV_DEV || ENV_TEST){
	AG.Cloud.debug = true;
	Ti.App.idleTimerDisabled = true;
}

// settings
Ti.Geolocation.purpose = '현재 위치 확인';
AG.facebook = require('facebook');
AG.facebook.appid = Ti.App.Properties.getString("ti.facebook.appid");
//AG.facebook.permissions = [FACEBOOK_APP_PERMISSIONS];

AG.currentLanguage = Ti.Locale.getCurrentLanguage();

AG.cameraInfo = {
	top : 44,
	width : 320,
	height : 180
};

//singleton Models (static id)
AG.settings = Alloy.Models.instance('settings');
AG.currentPosition = new Backbone.Model();
AG.settings.fetch();
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


