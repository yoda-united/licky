/**
 * - 글 작성 후 
 * - 댓글 작성 후
 * - 알림 탭에서
 */
AG.settings = Alloy.Models.instance('settings');

var args = arguments[0] || {};

function onClickCancel(){
	AG.settings.set('haveCanceledLocalPushDialog',true);
	$.getView().close();
}

function onClickPlease(){
	// push notification
	registerForPushNotifications({
		success : function(e){
			$.getView().close();
		}
	});	
}

function registerForPushNotifications(args){
	args = args || {};
	
	// alert(Ti.Network.remoteNotificationsEnabled);
	// alert(Ti.Network.remoteNotificationTypes);
	if( OS_IOS ){
		Ti.API.info(Ti.Network.registerForPushNotifications);
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
				_.isFunction(args.error) && args.error();
			},
			success: function(e){
				AG.settings.save("deviceToken", Ti.Network.getRemoteDeviceUUID() );
				subscribePushChannel(args);
				_.isFunction(args.success) && args.success();
			}
		});
		AG.settings.save("haveRequestPushRegist", true);
	}
}


function tryRegisterPush(args){
	args = args || {};
	if(args.title) $.title.text = args.title;

	if(args.force){
		if(!Ti.Network.remoteNotificationsEnabled && AG.settings.get('haveRequestPushRegist')){ //허용하지 않음 : 설정앱에서 변경해야함을 안내하자
			alert(L('turnOnRemotePushAtSettings'));
		}else{ // 아직 한번도 허용할지 물어보지 않음 : 물어보자!
			registerForPushNotifications(args);
		}
		return;	
	}
	//허용 된 상태이거나 내부 허용 dialog(allowPushDialog)에서 취소를 누른적 있거나 
	if(Ti.Network.remoteNotificationsEnabled || AG.settings.get('haveCanceledLocalPushDialog')){  
		// 채널 subscribed가 되어 있는지 설정값으로 확인 후 안되어있는 channel만 다시 subscribe 요청
		// 일단 현재는 아무 일도 안함
	}else{
		if(AG.settings.get('haveRequestPushRegist')){ //허용하지 않음 : 설정앱에서 변경해야함을 안내하자
			alert(L('turnOnRemotePushAtSettings'));
		}else{ // 아직 한번도 허용할지 물어보지 않음 : 물어보자!
			$.getView().open();
		}	
	}
};
exports.tryRegisterPush = tryRegisterPush;

var subscribePushChannel = function(args) {
	args = args || {};
	var channels = args.channels || ['broadcast', 'comment'];
	var params = {
		device_token : AG.settings.get('deviceToken'),
		type : OS_IOS ? "ios" : "android"
	};

	if (params.device_token) {
		_.each(channels, function(channel) {
			if (!AG.settings.get(channel + 'Subscribed') || args.force) {
				AG.Cloud.PushNotifications.subscribe(_.extend({
					channel : channel
				}, params), function(e) {
					if (e.success) {
						AG.settings.save(channel + 'Subscribed', true);
					} else {
					}
				});
			}
		});
	}
};

var unsubscribePushChannel = function(args) {
	args = args || {};
	var channels = args.channels || ['broadcast', 'comment'];
	var params = {
		device_token : AG.settings.get('deviceToken'),
		type : OS_IOS ? "ios" : "android"
	};

	if (params.device_token) {
		_.each(channels, function(channel) {
			AG.Cloud.PushNotifications.unsubscribe(_.extend({
				channel : channel
			}, params), function(e) {
				if (e.success) {
					AG.settings.save(channel + 'Subscribed', false);
				} else {
				}
			});
		});
	}
};

AG.settings.on('change:cloudSessionId', function(){
	if (AG.isLogIn()) {
		if(Ti.Network.remoteNotificationsEnabled){
			tryRegisterPush({
				force:true
			});  
		}else{
			subscribePushChannel();
		}
	}else{
		unsubscribePushChannel();
	}
});

// 시스템 remote push 는 혀용했으나 subscribe 된 기록이 없을 경우 subscribe함
_.defer(function(){
	if(AG.isLogIn && AG.isLogIn() && Ti.Network.remoteNotificationsEnabled){
		// push callback 등록이 필요하므로 allowPush 컨트롤러를 통해야한다.
		tryRegisterPush({
			force:true
		});  
	}
});