/**
 * - 글 작성 후 
 * - 댓글 작성 후
 * - 알림 탭에서
 */

var args = arguments[0] || {};

if(args.title) $.title.text = args.title;
function onClickCancel(){
	$.getView().close();
}

function onClickPlease(){
	// push notification
	registerForPushNotifications(function(e){
		alert(e);
		$.getView().close();
	});	
}

function registerForPushNotifications(cb){
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
			},
			success: function(e){
				_.isFunction(cb) && cb(e);
				AG.settings.save("deviceToken", Ti.Network.getRemoteDeviceUUID() );
				AG.loginController.subscribePushChannel();
			}
		});
		//AG.settings.save("haveRequestPushRegist", true);
	}
}

exports.tryRegisterPush = function(args){
	// 기존에 푸쉬가 허용되어있는지 확인
	// acs에 동록되어있는 여부 확인 : property로 저장해둠
	// 허용이 안되어 있으면 open
	// 허용이 되어 있으면 acs에 등록되어있는지 여부 확인
	
	if(1 || !AG.settings.get('haveRequestPushRegist')){
		$.getView().open();
	}
};


