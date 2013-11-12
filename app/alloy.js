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

//alias
var AG = Alloy.Globals;

// Cloud는 Global에서 바로 접근하도록 함.
var Cloud = require('ti.cloud');

// settings
Ti.Geolocation.purpose = '현재 위치 확인';
AG.facebook = require('facebook');
AG.facebook.appid = "***REMOVED***";
//AG.facebook.permissions = [FACEBOOK_APP_PERMISSIONS];


//singleton Models (static id)
AG.settings = Alloy.Models.instance('settings');
AG.settings.fetch();
AG.loggedInUser = Alloy.Models.instance('loggedInUser');
AG.loggedInUser.fetch();