/**
 * - 글 작성 후 
 * - 댓글 작성 후
 * - 알림 탭에서
 */

var args = arguments[0] || {};

if(args.title) $.title.text = args.title;
function onClickCancel(){
	AG.settings.set('haveCanceledLocalPushDialog',true);
	$.getView().close();
}

function onClickPlease(){
	// push notification
	registerForPushNotifications(function(e){
		$.getView().close();
	});	
}

function registerForPushNotifications(channels){
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
				AG.settings.save("deviceToken", Ti.Network.getRemoteDeviceUUID() );
				AG.loginController.subscribePushChannel({channels:channels, force:true});
			}
		});
		AG.settings.save("haveRequestPushRegist", true);
	}
}

exports.tryRegisterPush = function(args){	
	args = args || {};
	if(args.force){
		if(!Ti.Network.remoteNotificationsEnabled && AG.settings.get('haveRequestPushRegist')){ //허용하지 않음 : 설정앱에서 변경해야함을 안내하자
			alert(L('turnOnRemotePushAtSettings'));
		}else{ // 아직 한번도 허용할지 물어보지 않음 : 물어보자!
			registerForPushNotifications(function(e){
				Ti.API.info(e);
			});
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




