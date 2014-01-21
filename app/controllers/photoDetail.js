var args = arguments[0] || {},
	photoModel = args.photoModel;

/**
 * Google Map
 */
var GoogleMapsClass = require('GoogleMaps');
var GoogleMaps = new GoogleMapsClass({
	iOSKey: "***REMOVED***"
});
var coord = photoModel.get("custom_fields").coordinates;
var mapView = GoogleMaps.initMap({
	latitude:coord[0][1],
	longitude:coord[0][0],
	zoom: 16, //15, 16이 적당해 보임
	width : Ti.UI.FILL,
	height : 90,
});
var mapWrap = Ti.UI.createView({
	width : Ti.UI.FILL,
	height : 90,
	// touchEnabled : false
});
mapWrap.add(mapView);
$.mapSection.footerView = mapWrap;

$.listView.addEventListener('itemclick', function(e) {
	if (e.bindId == "profileImage") {
		AG.utils.openController(AG.mainTabGroup.activeTab, 'profile', {
			//user가 backbone 모델 형태가 아니므로 model로 만들어서 넘겨준다.
			userModel : Alloy.createModel('user', photoModel.get('user'))
		});
	}
});

function resetPhotoContent(){
	var contentItem = photoModel.doDefaultTransform();
	contentItem.template = 'photoItemTemplate';
	if(OS_IOS){
		contentItem.properties.selectionStyle = Ti.UI.iPhone.ListViewCellSelectionStyle.NONE;
	}
	contentItem.properties.height = 180;
	$.contentSection.setItems([
		contentItem
	]);
}
resetPhotoContent();

photoModel.on('change',resetPhotoContent);




var commentCol = Alloy.createCollection('review');

var testLabel = Ti.UI.createLabel();
var resetCommentItems = function(){
	var items = [];
	commentCol.each(function(comment){
		var item = comment.doDefaultTransform();
		item.template = "commentTemplate";
		if(!comment.get('_itemHeight')){
			testLabel.text = comment.get('content');
			comment.set({
				'_itemHeight' : testLabel.heightFromWidth(220)	
			},{
				silent : true
			});
		}
		item.properties.height = comment.get('_itemHeight')+23;
		items.push(item);
	});
	$.commentSection.setItems(items);
	return items;
};

commentCol.on('reset',function(col){
	resetCommentItems();
});
commentCol.on('add',function(model,col,options){
	// TODO : 원인파악 필요. append 썼을 때 imateView의 load 이벤트 핸들링 때문인지 이상해짐. 일단 전부 다시 그림
	var items = resetCommentItems();
	var item = model.doDefaultTransform();

	//TODO : 딜레이 0을 주었지만 이건 나중에 깔끔한 해결책 찾아야함. reset이 아닌 addItem을 하면 잘 될것 같기도 함.
	// 실제 item이 세팅되기 전에 scrollTo가 실행되어서 ui가 깨짐
	setTimeout(function(){ 
		$.listView.scrollToItem(2,$.commentSection.items.length-1);	
	},0);
});


function fetchComments(){
	commentCol.fetch({
		data : {
			photo_id : photoModel.id,
			per_page : 1000 //TODO : 일단 1000개로 했지만 추후 변경 필요 
		}
	});
}
fetchComments();


/**
 * 신고 or 삭제 기능 (자신의 사진이면 삭제, 타인의 사진이면 신고 기능)
 */
// alert(JSON.stringify(photoModel.get('user').id)+ "\n "+ AG.loggedInUser.get('id'));
if(photoModel.get('user').id === AG.loggedInUser.get('id')){
	$.deleteDialog.addEventListener('click', function(e) {
		if (e.index === 0) {
			photoModel.destroy({
				success:function(e){
					$.photoDetail.close();
				},
				error:function(e){
					alert(L("failToDelete"));
				}
			});
		}
	});
	$.moreButton.addEventListener('click', function(e){
		$.deleteDialog.show();
	});
}else{
	var reportCol = Alloy.createCollection('report');
	$.reportDialog.addEventListener('click', function(e) {
		if (e.index === 0) {
			Alloy.createModel('report').save({
					class_name : "reports",
					fields : {
						"target_photo_id": photoModel.get('id')
					}
				},{
					success: function(e){
						alert(L("successReportedInappropriate"));
					},
					error: function(e){
						alert(L("failToReport"));
					}		
			});	
		}
	});
	$.unReportDialog.addEventListener('click', function(e) {
		if (e.index === 0) {
			reportCol.at(0).destroy({
				success: function(e){
					alert("successUnReport");
				},
				error: function(e){
					alert("failUnReport");
				}
			});
		}
	});
	$.moreButton.addEventListener('click', function(e){
		reportCol.fetch({
			data:{
				class_name: "reports",
				response_json_depth: 1,
				where: {
					user_id: AG.loggedInUser.get('id'),
					fields: {target_photo_id: photoModel.get('id')}
				},
				limit: 1
			},
			success: function(e){
				(reportCol.length > 0)? $.unReportDialog.show() : $.reportDialog.show();
			},
			error: function(e){
				alert("networkFailure");
			}
		});
	});
}



$.commentField.addEventListener('focus', function(e) {
	if(OS_IOS){
		$.mainWrap.animate({
			bottom:216,
			duration : 200
		});
	}
	$.listView.scrollToItem(2,$.commentSection.items.length-1);	
});
$.commentField.addEventListener('blur', function(e) {
	if(OS_IOS){
		$.mainWrap.animate({
			bottom:0,
			duration : 200
		});
	}
});

var doCommentBlur = function(){
	if(OS_IOS){
		$.mainWrap.animate({
			bottom:0,
			duration : 200
		});
	}
	$.commentField.blur();
};

$.listView.addEventListener('singletap', function(e) {
	//$.commentField.blur();
	doCommentBlur();
});

$.listView.addEventListener('delete', function(e) {
	if(e.sectionIndex==2){ //댓글 
		var comment = commentCol.get(e.itemId);
		comment.destroy({
			success: function(){
				var current = photoModel.get('reviews_count')-1;
				if(current>=0){
					photoModel.set('reviews_count',current);
				}
			},
			error : function(e){
				alert(e);
				alert('댓글을 정상적으로 삭제하지 못했습니다.\n새로고침 후 다시 시도해주세요.');
			}
		});
	}
});

$.sendBtn.addEventListener('click', function(e) {
	//alert($.commentField.value);
	$.sendBtn.enabled = false;
	commentCol.create({
		photo_id: photoModel.id,
	    content: $.commentField.value,
	    allow_duplicate : true
	},{
		wait : true, //TODO : wait true하기전에 먼저 보여주고 나중에 update하도록 변경
		success : function(nextModel, resp){
			$.commentField.value = '';
			doCommentBlur();
			$.sendBtn.enabled = true;
			
			//댓글 개수가 2개 이상 차이가 나면 댓글을 다시 불러옴.. 아니면 말구
			if(nextModel.attributes.photo.reviews_count - photoModel.get('reviews_count')>1){
				fetchComments();
			}
			photoModel.set(nextModel.attributes.photo);
		},
		error : function(){
			$.sendBtn.enabled = true;
		}
	});
});

if(OS_IOS){
	Ti.App.addEventListener('keyboardframechanged', function(e) {
		if(e.keyboardFrame.width==320 && e.keyboardFrame.y<400){ //appear
			$.mainWrap.bottom = e.keyboardFrame.height;
		}else{ //disappear
			
		}
	});
}

function onMapClick(e){
	alert(e);
}

function hiddenProfileOnLoad(){
	// _.find(this.parent.children,function(proxy){
		// return proxy.bindId === 'profileImage';
	// }).image = this.image;
	this.parent.children[2].image = this.image;
	//TODO : proxy찾는 하드코딩된 부분을 제거
}
