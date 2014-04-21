var args = arguments[0] || {};




var chatCol = Alloy.createCollection('chat');



//따로 채팅기능 구현이 있을 수 있으므로 push용 구분을 위해 system용 id를 같이 넣어준다.

function addSystemPushId(arr){
	arr.push((ENV_DEV || ENV_TEST)?"5345c10f891fdf43ba114cec":"5345c244891fdf43ba114e39");
	return arr;
}



chatCol.defaultFetchData = {
	participate_ids : addSystemPushId([AG.loggedInUser.get('id')]).join(','),
	where : {
		updated_at: { '$gt': AG.moment().subtract('days', 7).toISOString() } // 최근 7일
		//"user_id" : { "$ne" : AG.loggedInUser.get('id') }
		// from: { id : {'$ne' : "52841ff87bf3190b300173ea"} }
	}
}; // 상속할때 where에 추가하고 싶으면 여기에 지정


function onChangeLoginUser(){
	if(chatCol.defaultFetchData){
		chatCol.defaultFetchData.participate_ids = addSystemPushId([AG.loggedInUser.get('id')]).join(',');
	};
}

AG.settings.on('change:cloudSessionId', onChangeLoginUser);



$.listViewC.setCollection(chatCol);

$.listViewC.setTemplateControls([
	'pushItemTemplate'
]);

$.getView().addEventListener('focus', function(e) {
	chatCol.fetch();
});

$.listViewC.on('itemclick',_.throttle(function(e){
	var data = JSON.parse(e.model.get('message'));
	AG.utils.openController(AG.mainTabGroup.activeTab, 'postDetail', {
		post_id : data.post_id
	});
},1000));
