var args = arguments[0] || {};
var chatCol = Alloy.createCollection('chat');
var animation = require('alloy/animation');

/**
 * UI init
 */
$.listHeaderView.parent.remove($.listHeaderView);
$.thanksListHeaderView.parent.remove($.thanksListHeaderView);
// $.listViewC.topSection.headerView = $.listHeaderView;

var lastRemoteNotificationsEnabled=Ti.Network.remoteNotificationsEnabled;
function resumedHandler(){
	var currentRemoteNotificationsEnabled = Ti.Network.remoteNotificationsEnabled;
	if(!currentRemoteNotificationsEnabled){
		$.listViewC.listView.headerView = $.listHeaderView;	
	}else{
		if(!lastRemoteNotificationsEnabled){
			AG.allowPushController.tryRegisterPush({force:true}); 
			$.listViewC.listView.headerView = $.thanksListHeaderView;
			setTimeout(function(){
				$.listViewC.listView.headerView = null;
			},4000);
		}else{
			$.listViewC.listView.headerView = null;
		}
	}
	lastRemoteNotificationsEnabled=currentRemoteNotificationsEnabled;
}

$.getView().addEventListener('focus', function(e) {
	resumedHandler();
	Ti.App.addEventListener('resumed', resumedHandler);
});

$.getView().addEventListener('blur', function(e) {
	Ti.App.removeEventListener('resumed', resumedHandler);
});

chatCol.on('reset',function(col){
	if(!col.length){
		//$.pushGuideText.text = '아직 알림이 없네요,\n' + $.pushGuideText.text;
	}else{
		
	}
});



function setDefaultFetchData(){
	if( !AG.isLogIn() ){
		chatCol.reset();
	}
	chatCol.defaultFetchData = {
		participate_ids : [
			//따로 채팅기능 구현이 있을 수 있으므로 push용 구분을 위해 system용 id를 같이 넣어준다.
			(Ti.App.id!=="co.licky.www")?"5345c10f891fdf43ba114cec":"5345c244891fdf43ba114e39",
			AG.loggedInUser.get('id') ].join(','),
		where : {
			updated_at: { '$gt': AG.moment().subtract('days', 31).toISOString() }, // 최근 31일
			from_id: { "$ne": AG.loggedInUser.get('id')}	// 자신이 포스트한 것이 아닌것만
		}
	}; // 상속할때 where에 추가하고 싶으면 여기에 지정
}
setDefaultFetchData();

AG.loggedInUser.on('change:id', setDefaultFetchData);

$.listViewC.setCollection(chatCol);

$.listViewC.setTemplateControls([
	'pushItemTemplate'
]);

$.listViewC.on('itemclick', _.throttle(function(e){
	var data = JSON.parse(e.model.get('message'));
	AG.utils.openController(AG.mainTabGroup.activeTab, 'postDetail', {
		post_id : data.post_id
	});
},1000));

$.pushAllowButton.addEventListener('click', function(e) {
	AG.allowPushController.tryRegisterPush({
		title : L('successCommentUpload'),
		force : true
	});
});



$.getView().addEventListener('focus', function(e) {
	// 문서에는 명시돼 있지 않지만 로긴한 사용자만 쿼리 날릴수 있는 듯.
	if( AG.isLogIn() ){
		chatCol.fetch();
	}
});
  
chatCol.on('reset', function(col){
	AG.notifyController.setBadge(0);
	if(col.length === 0){
		$.listViewC.listView.footerView = Alloy.createController('noItemView',{
			iconText : '\uf16d',
			labelText : L('noPushItem')						
		}).getView();
	}
});
