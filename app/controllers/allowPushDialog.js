/**
 * - 글 작성 후 
 * - 댓글 작성 후
 * - 알림 탭에서
 */

var args = arguments[0] || {};

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
	if( OS_IOS ){
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
	}
}
exports.registerForPushNotifications = registerForPushNotifications;
