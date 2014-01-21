// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};
var newrelic = require('ti.newrelic'); 
newrelic.start("***REMOVED***");


//alias
var AG = Alloy.Globals;

Titanium.UI.createMaskedImage;

// colors
AG.COLORS = require('colors');

//utils
AG.utils = require('utils');

// var slimer = require("ti.cloud.slimer");
// slimer.application_index(function(r,e){
	// Ti.API.info(JSON.stringify(r));
// });
// Ti.API.info("asdi");
// var NappUI = require("dk.napp.ui");

// Cloud는 Global에서 바로 접근하도록 함.
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


// AG.moment = require('alloy/moment');
AG.moment = require('momentExtend');
moment.lang(AG.currentLanguage);

AG.cameraInfo = {
	top : 100,
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


