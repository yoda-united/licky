var args = arguments[0] || {};
var chatCol = Alloy.createCollection('chat');

function setDefaultFetchData(){
	chatCol.defaultFetchData = {
		participate_ids : [
			//따로 채팅기능 구현이 있을 수 있으므로 push용 구분을 위해 system용 id를 같이 넣어준다.
			(ENV_DEV || ENV_TEST)?"5345c10f891fdf43ba114cec":"5345c244891fdf43ba114e39",
			AG.loggedInUser.get('id') ].join(','),
		where : {
			updated_at: { '$gt': AG.moment().subtract('days', 31).toISOString() }, // 최근 31일
			from_id: { "$ne": AG.loggedInUser.get('id')}	// 자신이 포스트한 것이 아닌것만
		}
	}; // 상속할때 where에 추가하고 싶으면 여기에 지정
}
setDefaultFetchData();

function onChangeLoginUser(){
	setDefaultFetchData();
	
	if(!AG.settings.get('cloudSessionId')){
		chatCol.reset();
	}	
}
AG.settings.on('change:cloudSessionId', onChangeLoginUser);

$.listViewC.setCollection(chatCol);

$.listViewC.setTemplateControls([
	'pushItemTemplate'
]);

$.listViewC.on('itemclick',_.throttle(function(e){
	var data = JSON.parse(e.model.get('message'));
	AG.utils.openController(AG.mainTabGroup.activeTab, 'postDetail', {
		post_id : data.post_id
	});
},1000));

chatCol.fetch();
$.getView().addEventListener('focus', function(e) {
});