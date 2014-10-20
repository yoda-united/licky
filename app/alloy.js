Titanium.UI.backgroundColor = 'white';
if(ENV_PRODUCTION){
	var newrelic = require('ti.newrelic'); 
	newrelic.start(Ti.App.Properties.getString('newrelic-key'));
}


//alias
var AG = Alloy.Globals;
AG.slimer = require("ti.cloud.slimer");

AG.currentLanguage = Ti.Locale.getCurrentLanguage();

//extend library
AG.moment = require('momentExtend');
AG.moment.lang(AG.currentLanguage);
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

var platformVersionInt = parseInt(Ti.Platform.version, 10);
(function(){
	var platformHeight = Ti.Platform.displayCaps.platformHeight;
	Alloy.Globals.is = {
		iOS7 : (OS_IOS && platformVersionInt == 7),
		iOS8 : (OS_IOS && platformVersionInt >= 8),
		talliPhone : (OS_IOS && platformHeight == 568),
		iPhone6 : (OS_IOS && platformHeight == 667),
		iPhone6Plus : (OS_IOS && platformHeight == 736)
	};
})();

AG.cameraInfo = {
	top : 44,
	width : 320,
	height: 256 // 1136/2 - 44 - 216 - 52
	// height : 180
};

//settings가 먼저 이뤄저야함
//singleton Models (static id)
AG.settings = Alloy.Models.instance('settings');
// AG.currentPosition = new Backbone.Model();
AG.settings.fetch({
	success: function(){
		if( !AG.settings.get('isWalkthroughMaster') ){
			Alloy.createController('walkthrough').getView().open();
		}
		if( AG.settings.get('cloudSessionId') ){
			AG.Cloud.sessionId = AG.settings.get('cloudSessionId');
			AG.Cloud.Users.showMe(function(e) {
				if (e.success) {
					var user = e.users[0];
					AG.loggedInUser.save(user);
				} else {
					//alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
				}
			}); 
		}
		if( !AG.settings.has("platformHeight") ){
			AG.settings.save("platformHeight", Ti.Platform.displayCaps.platformHeight);
		}	
		if( !AG.settings.has("postWithFacebook") ){
			AG.settings.save("postWithFacebook", true);
		}
		if( !AG.settings.has("postWithLocation") ){
			AG.settings.save("postWithLocation", true);
		}
	}
});

//singleton Controller;
AG.loginController =  Alloy.createController('login');
AG.notifyController = Alloy.createController('notifyView');
AG.allowPushController = Alloy.createController('allowPushDialog');


AG.loggedInUser = Alloy.Models.instance('loggedInUser');
AG.loggedInUser.fetch(); //주의! : properties 아답터를 사용하므로 동기 방식.
AG.isLogIn = function(){
	return !!AG.settings.get('cloudSessionId');
};



AG.currentPosition = Alloy.Models.instance('currentPosition');
AG.currentPosition.update();

var appMetaDebounce = _.debounce(function() {
	Alloy.createWidget('appMetaFromACS').fetch();
});
setTimeout(appMetaDebounce,3000);
Ti.App.addEventListener('resume', appMetaDebounce);

Ti.App.addEventListener('changeBadge', function(e){
	Ti.UI.iPhone.setAppBadge(e.number);
});

//override default ti api
alert = function(args){
	var title, message;
	var param = {};
	if(typeof args !== 'object'){
		param.message = args;
		param.title = '';
	}
	var alertDialog = Titanium.UI.createAlertDialog(param);
	alertDialog.show();
};

Ti.Analytics.featureEvent('app.start');
Ti.App.addEventListener('resume', function(e) {
	Ti.Analytics.featureEvent('app.resume');
});

