var currentWindow = $.photoList;
var NUM_PER_PAGE = 10;
$.defaultFetchData = {
	order : "-created_at"
};


$.loadingActivity.show();

function showCamera(){
	AG.loginController.requireLogin(function(){
			Alloy.createController('cameraOveray',{
				collection : photoCol
			}).showCamera();
	});
}

var photoCol = Alloy.createCollection('photo');
var items = []; 


/**
 * 다음페이지를 더 불러올지를 판단하여 listView의 marker를 지정한다.
 * 다 불러왔을 때는 다 불러왔음을 표시하는 item 을 맨 하단에 추가한다.
 * @param {Object} col
 * @param {Object} itemIndex
 */
function updateListMarker(col,itemIndex){
	if(col.meta && col.meta.total_pages>col.meta.page){
		$.listView.setMarker({
			sectionIndex:0,
			itemIndex : $.section.items.length-1
		});
	}else{
		//끝까지 로딩 한경우
		$.listView.footerView = Ti.UI.createLabel({
			height : 30,
			text : '-'
		});
	}
}

photoCol.on('reset change',function(col,option){
	items = [];
	photoCol.each(function(photo){
		Ti.API.info(photo.attributes);
		var item = photo.doDefaultTransform();
		
		items.push(item);
	});
	
	////이상한 에니메이션이 싫어서 넣은 코드
	//TODO : 이 버그 수정되면 없애야할 코드 https://jira.appcelerator.org/browse/TC-3432
	$.section.deleteItemsAt(NUM_PER_PAGE-1,$.section.items.length-NUM_PER_PAGE, {
		animated : false,
		animationStyle : Ti.UI.iPhone.RowAnimationStyle.NONE
	});
	
	$.section.setItems(items,{
		animated : false,
		animationStyle : Ti.UI.iPhone.RowAnimationStyle.NONE
	}
	);
	
	
	$.listView.footerView = $.loadingFooterView;
	
	updateListMarker(col);
});

var willAddItems = [];
photoCol.on('add',function(model,col,options){
	if(options && options.addLater){
		willAddItems.push(model.doDefaultTransform());
	}else{
		$.section.insertItemsAt(0,[model.doDefaultTransform()],{
			
		});
	}
});

$.listView.addEventListener('marker', function(e) {
	photoCol.fetch({
		data : _.extend({
			per_page : photoCol.meta.per_page,
			page : photoCol.meta.page+1
		},$.defaultFetchData),
		add : true,
		addLater : true,
		success : function(col){
			//photoCol.trigger('reset',photoCol);
			//flush stack
			$.section.appendItems(willAddItems,{
				animated : false,
				animationStyle : Ti.UI.iPhone.RowAnimationStyle.NONE
			});
			willAddItems = [];
			updateListMarker(col);
		}
	});
});

$.listView.addEventListener('itemclick', function(e) {
	if(e.itemId){
		AG.utils.openController(AG.mainTabGroup.activeTab,
			'photoDetail',
			{
				photoModel : photoCol.get(e.itemId) //clicked Model
			}
		);
	}
});

$.listView.addEventListener('delete', function(e) {
	var photo = photoCol.get(e.itemId);
	photo.destroy({
		success: function(){
			
		},
		error : function(){
			alert('정상적으로 삭제하지 못했습니다. 새로고침 후 다시 시도해주세요.');
		}
	});
});



$.afterWindowOpened = function(){
	photoCol.fetch({
		data : _.extend({
			per_page : NUM_PER_PAGE,
		},$.defaultFetchData)
	});
};
exports.getCollection = function(){
	return photoCol;
};


currentWindow.addEventListener('open', function(){
	$.afterWindowOpened();
});



Titanium.Geolocation.getCurrentPosition(function(e){
	if (!e.success || e.error)
	{
		// currentLocation.text = 'error: ' + JSON.stringify(e.error);
		Ti.API.info("Code translation: "+translateErrorCode(e.code));
		alert('error ' + JSON.stringify(e.error));
		return;
	}
	AG.currentPosition.set(e.coords);	
	//photoCol.trigger('reset',photoCol);
});


if(OS_IOS){
	var control = Ti.UI.createRefreshControl({
	    tintColor:'red'
	});
	$.listView.refreshControl=control;
	control.addEventListener('refreshstart',function(e){
	    Ti.API.info('refreshstart');
	    photoCol.fetch({
			data : _.extend({
				per_page : NUM_PER_PAGE,
			},$.defaultFetchData),
			success : function(col){
				control.endRefreshing();
			},
			error : function(){
				control.endRefreshing();
			},
			reset : true
		});
	});
	
	/*
	$.listView.applyProperties({
		refreshControlEnabled: true, // optional
	    refreshControlTintColor: '#f00', // optional
	   // refreshControlBackgroundColor: '#00f', // optional
	});
	
	$.listView.refreshBegin();
	
	$.listView.addEventListener('refreshstart',function(e){
	    Ti.API.info('refreshstart');
	    photoCol.fetch({
			data : _.extend({
				per_page : NUM_PER_PAGE,
			},$.defaultFetchData),
			success : function(col){
				$.listView.refreshFinish();
			},
			error : function(){
				$.listView.refreshFinish();
			},
			reset : true
		});
	});	
	*/
}

//TEST CODE
// currentWindow.addEventListener('open', function(e) {
	// var cacheModel = Alloy.createModel('photo');
	// cacheModel.set({"id":"528c6a3f00de2c0b32001120","filename":"175d6f20.png","size":498765,"md5":"b85ab0884d1b5e08707f0aed5f1fe487","created_at":"2013-11-20T07:52:31+0000","updated_at":"2013-11-20T07:52:36+0000","processed":true,"user":{"id":"52841ff87bf3190b300173ea","first_name":"jongeun","last_name":"lee","created_at":"2013-11-14T00:57:28+0000","updated_at":"2013-11-14T00:57:28+0000","external_accounts":[{"external_id":"1417938346","external_type":"facebook"}],"confirmed_at":"2013-11-14T00:57:28+0000","admin":"false"},"title":"이건 왜 자꾸 줄어드는 기분이지?","urls":{"square_75":"http://storage.cloud.appcelerator.com/P9mmtk4COHPiuvp1GF18IpnE8ydCbbRl/photos/e4/87/528c6a3f00de2c0b32001121/175d6f20_square_75.png","thumb_100":"http://storage.cloud.appcelerator.com/P9mmtk4COHPiuvp1GF18IpnE8ydCbbRl/photos/e4/87/528c6a3f00de2c0b32001121/175d6f20_thumb_100.png","small_240":"http://storage.cloud.appcelerator.com/P9mmtk4COHPiuvp1GF18IpnE8ydCbbRl/photos/e4/87/528c6a3f00de2c0b32001121/175d6f20_small_240.png","medium_500":"http://storage.cloud.appcelerator.com/P9mmtk4COHPiuvp1GF18IpnE8ydCbbRl/photos/e4/87/528c6a3f00de2c0b32001121/175d6f20_medium_500.png","medium_640":"http://storage.cloud.appcelerator.com/P9mmtk4COHPiuvp1GF18IpnE8ydCbbRl/photos/e4/87/528c6a3f00de2c0b32001121/175d6f20_medium_640.png","large_1024":"http://storage.cloud.appcelerator.com/P9mmtk4COHPiuvp1GF18IpnE8ydCbbRl/photos/e4/87/528c6a3f00de2c0b32001121/175d6f20_large_1024.png","original":"http://storage.cloud.appcelerator.com/P9mmtk4COHPiuvp1GF18IpnE8ydCbbRl/photos/e4/87/528c6a3f00de2c0b32001121/175d6f20_original.png"},"content_type":"image/png"});
	// AG.utils.openController(AG.mainTabGroup.activeTab,
		// 'photoDetail',
		// {
			// photoModel : cacheModel
		// }
	// );
// });