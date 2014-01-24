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



var photoCol = Alloy.createCollection('photo');
photoCol.on('reset',function(col){
	col.each(function(photo){
		Ti.API.info(photo.attributes);
		
		var post = Alloy.createModel('post');
		post.save({
			user_id: photo.get('user').id,
			title : photo.get('title'),
			content : '_#Are you hacker?? Free beer lover? Please contact us! (app@licky.co) :)#_',
			photo_id : photo.id,
			//created_at : AG.moment(photo.get('created_at')).toDate(),
			// updated_at : photo.get('updated_at'),
			custom_fields : photo.get('custom_fields')
		},{
			success : function(p){
				// var obj = {
					// title: 'new',
					// created_at : photo.get('created_at')
				// };
				// p.unset('photo');
				// p.save(obj);
			},
			error : function(e){
				// alert(e);
			}
		});
	});
});


// photoCol.fetch({
	// data : {
		// per_page : 1000,
		// page : 1,
		// order : "+created_at"
	// }
// }); 



