var args = arguments[0] || {},
	postModel = args.postModel;

// var mapWrap = Ti.UI.createView({
	// width : Ti.UI.FILL,
	// height : 90,
	// // touchEnabled : false
// });
// mapWrap.add(mapView);
// $.mapSection.headerView = mapWrap;

$.listView.addEventListener('itemclick', function(e) {
	if (e.bindId == "profileImage") {
		// alert(JSON.stringify(e));
		// alert(commentCol.get(e.itemId).get('user'));
		AG.utils.openController(AG.mainTabGroup.activeTab, 'profile', {
			//user가 backbone 모델 형태가 아니므로 model로 만들어서 넘겨준다.
			// userModel : Alloy.createModel('user', postModel.get('user'))
			userModel :e.section.id === "commentSection" ? Alloy.createModel('user', commentCol.get(e.itemId).get('user')) : Alloy.createModel('user', postModel.get('user'))
		});
	}
});

function resetPostContent(){
	var contentItem = postModel.doDefaultTransform();
	var photoHeight =  Ti.UI.createImageView({image:contentItem.photo.image}).toImage().height/2;
	contentItem.template = 'postItemTemplate';
	if(OS_IOS){
		contentItem.properties.selectionStyle = Ti.UI.iPhone.ListViewCellSelectionStyle.NONE;
	}
	contentItem.distance.height = 35; // 주소가 두줄 나오게 BOG-113
	// contentItem.properties.height = 180;
	// alert(Alloy.Globals.cameraInfo.width+","+ photoHeight);
	contentItem.photo.height = photoHeight;
	contentItem.properties.height = photoHeight;
	contentItem.properties.backgroundColor = Alloy.Globals.COLORS.whiteGray;
	// contentItem.photo.height = 180;
	$.contentSection.setItems([
		contentItem
	]);
}

postModel.on('change',resetPostContent);
resetPostContent();


var commentCol = Alloy.createCollection('review');

// TODO:다이나믹 스타일 적용 
var testLabel = Ti.UI.createLabel({
	font : {
		fontSize : 15,
		fontFamily : 'AppleSDGothicNeo-UltraLight'
	}});
var resetCommentItems = function(){
	var items = [];
	commentCol.each(function(comment){
		var item = comment.doDefaultTransform();
		item.template = "commentTemplate";
		if(!comment.get('_itemHeight')){
			testLabel.text = comment.get('content');
			comment.set({
				// '_itemHeight' : testLabel.heightFromWidth(220+16)	
				// '_itemHeight' : testLabel.heightFromWidth(320-84) 
				'_itemHeight' : testLabel.heightFromWidth(228)	// 320-39-22-16-15
			},{
				silent : true
			});
		}
		// item.properties.height = comment.get('_itemHeight') + 23;
		item.properties.height = comment.get('_itemHeight') + 48;
		
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
			order : '-created_at',
			post_id : postModel.id,
			per_page : 1000 //TODO : 일단 1000개로 했지만 추후 변경 필요 
		},
		error: function(e,resp){
			if( resp === "post not found" ){	// code 400
				alert(L('deletedLick'));
				$.postDetail.close();
			}
		}
	});
}



/**
 * 신고 or 삭제 기능 (자신의 사진이면 삭제, 타인의 사진이면 신고 기능)
 */
// alert(JSON.stringify(postModel.get('user').id)+ "\n "+ AG.loggedInUser.get('id'));
if(postModel.get('user').id === AG.loggedInUser.get('id')){
	$.deleteDialog.addEventListener('click', function(e) {
		if (e.index === 0) {
			postModel.destroy({
				success:function(e){
					$.postDetail.close();
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
						"target_post_id": postModel.get('id')
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
					alert(L("successUnReport"));
				},
				error: function(e){
					alert(L("failUnReport"));
				}
			});
		}
	});
	$.moreButton.addEventListener('click', _.throttle(function(e){
		var indi = Ti.UI.createActivityIndicator({
			style: Titanium.UI.iPhone.ActivityIndicatorStyle.DARK
		});
		$.postDetail.rightNavButton = indi;
		indi.show();
		
		reportCol.fetch({
			data:{
				class_name: "reports",
				response_json_depth: 1,
				where: {
					user_id: AG.loggedInUser.get('id'),
					fields: {target_post_id: postModel.get('id')}
				},
				limit: 1
			},
			success: function(e){
				(reportCol.length > 0)? $.unReportDialog.show() : $.reportDialog.show();
				$.postDetail.rightNavButton = $.moreButton;
			},
			error: function(e){
				alert("networkFailure");
				$.postDetail.rightNavButton = $.moreButton;
			}
		});
	},1000));
}

/* TODO: pullView가 alloy에서 먹지를 않는데 언젠간 되겠지 뭐..
if(OS_IOS){
	$.listView.pullView = Ti.UI.createView({
		// backgroundColor:'white',
		backgroundColor: Alloy.Globals.COLORS.lightWarmGray,
		height:400,
		width:320
	});
}*/

$.commentField.addEventListener('focus', function(e) {
	if(OS_IOS){
		$.mainWrap.animate({
			bottom:216,
			duration : 200
		});
	}
	if($.commentSection.items.length){
		$.listView.scrollToItem(2,$.commentSection.items.length-1);	
	}
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
				var current = postModel.get('reviews_count')-1;
				if(current>=0){
					postModel.set('reviews_count',current);
				}
			},
			error : function(e){
				alert('댓글을 정상적으로 삭제하지 못했습니다.\n새로고침 후 다시 시도해주세요.');
			}
		});
	}
});

$.sendBtn.addEventListener('click',_.throttle(function(e) {
	if(!_.str.trim($.commentField.value)){
		return;
	}
	//alert($.commentField.value);
	$.sendBtn.enabled = false;
	
	AG.loginController.requireLogin({
		success : function(){
			commentCol.create({
				post_id: postModel.id,
			    content: $.commentField.value,
			    allow_duplicate : true
			},{
				wait : true, //TODO : wait true하기전에 먼저 보여주고 나중에 update하도록 변경
				success : function(nextModel, resp){
					$.commentField.value = '';
					doCommentBlur();
					$.sendBtn.enabled = true;
					
					//댓글 개수가 2개 이상 차이가 나면 댓글을 다시 불러옴.. 아니면 말구
					// if(nextModel.attributes.post.reviews_count - postModel.get('reviews_count')>1){
						// fetchComments();
					// }
					postModel.set('reviews_count',postModel.get('reviews_count')+1);
				},
				error : function(){
					$.sendBtn.enabled = true;
				}
			});
		},
		cancel : function(){
			$.sendBtn.enabled = true;
		},
		message : L('commentNeedsLogin')
	});
},1000));

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


$.getView().addEventListener('open', function(e) {
	/**
	 * Google Map
	 */
	var GoogleMapsClass = require('GoogleMaps');
	var GoogleMaps = new GoogleMapsClass({
		iOSKey: "***REMOVED***"
	});
	var coord = postModel.get("custom_fields").coordinates;
	var mapView = GoogleMaps.initMap({
		latitude:coord[0][1],
		longitude:coord[0][0],
		zoom: 16, //15, 16이 적당해 보임
		width : 304,
		height : 119,
		top:0
	});
	$.mapWrap.add(mapView);
	
	fetchComments();
});