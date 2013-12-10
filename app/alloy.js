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
}

// settings
Ti.Geolocation.purpose = '현재 위치 확인';
AG.facebook = require('facebook');
AG.facebook.appid = Ti.App.Properties.getString("ti.facebook.appid");
//AG.facebook.permissions = [FACEBOOK_APP_PERMISSIONS];
AG.moment = require('alloy/moment');
moment.lang('ko', {
//    
    // longDateFormat : {
        // LT : "A h시 mm분",
        // L : "YYYY.MM.DD",
        // LL : "YYYY년 MMMM D일",
        // LLL : "YYYY년 MMMM D일 LT",
        // LLLL : "YYYY년 MMMM D일 dddd LT"
    // },
    relativeTime : {
        future : "in %s",
        past : "%s",
        s : "1s",
        ss : "%ds",
        m : "1m",
        mm : "%dm",
        h : "1h",
        hh : "%dh",
        d : "1d",
        dd : "%dd",
        M : "L",
        MM : "L",
        y : "L",
        yy : "L"
    }
});

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
AG.loggedInUser.fetch();


AG.loginController =  Alloy.createController('login');


//utils
AG.utils = require('utils');
