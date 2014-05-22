/**
 * notifyView.js
 * 
 */


var args = arguments[0] || {};

var THIS_HEIGHT = $.notifyView.getHeight(), 
	DURATION = 2900;
var processing,
	timerId,
	queue = [], 
	nowExposing = false;
var dummyWindow = Ti.UI.createWindow({
	fullscreen: true,
	top:-1,
	height:1
});	

function _hide(){
	clearTimeout(timerId);
	$.notifyView.animate({
		duration: 100,
		top: -THIS_HEIGHT
	}, function(){
		// Ti.API.info("[notifyView] queue length: "+ queue.length);
		if (queue.length > 0){
			_notifies();
		}else{
			dummyWindow.close();
			nowExposing = false;
		}
	});	
}
function _notifies(){
	processing = queue.shift();
	var pushEvent = processing.pushEvent;
	var message = processing.message || pushEvent.data.alert;

	if(pushEvent && pushEvent.inBackground){
		AG.setAppBadge(0);
		_doAction();
	}else{
		// expose
		$.message.setText(message);
		$.notifyView.fireEvent( "notifyExpose", {ndata: processing});
		$.notifyView.animate({
			duration: 100,
			top:0
		});
	}

	// notibar를 보여주지 않아도 queue는 일정 간격으로 계속 처리 하기 위해 실행 		
	timerId = setTimeout(_hide, processing.duration || DURATION);
	// timerId = setTimeout(_hide, 2900);
}

function _doAction(){
	var pushEvent = processing.pushEvent;

	if( pushEvent && pushEvent.data.post_id ){
		AG.utils.openController(AG.mainTabGroup.activeTab, 'postDetail', {
			post_id: pushEvent.data.post_id
		});
	}
}
$.notifyView.addEventListener('click', function(){
	_doAction();
	_hide();
});


/**
 * 노티할 객체를 큐에 담아 놓고 하나씩 보여준다. message와 pushEvent 둘중 하나는 셋팅 해줘영 
 * @param {options} 노티할 객체 
 * @param {options.message} notibar에 보여질 메세지 
 * @param {options.pushEvent} pushNotification으로 받은 이벤트 객체  
 * @param {options.duration} 보여질 시간 
 * @example
 * AG.notifyController.push({
 *	message: "hello"
 * });
 * AG.notifyController.push({
 * 	message: "fucking"
 * });
 * AG.notifyController.push({
 * 	message: "world"
 * });
 */
exports.push = function(options){
	// queueing
	queue.push(options);
	if( nowExposing ){
		return;
	}
	nowExposing = true;
	dummyWindow.open();
	_notifies();
};



	
