var args = arguments[0] || {},
	postModel = args.postModel;

$.listView.addEventListener('itemclick', function(e) {
	switch(e.bindId){
		case "profileImage":
			AG.utils.openController(AG.mainTabGroup.activeTab, 'profile', {
				//user가 backbone 모델 형태가 아니므로 model로 만들어서 넘겨준다.
				// userModel : Alloy.createModel('user', postModel.get('user'))
				userModel :e.section.id === "commentSection" ? Alloy.createModel('user', commentCol.get(e.itemId).get('user')) : Alloy.createModel('user', postModel.get('user'))
			});
		break;
		case "like":
			var likeModel = Alloy.createModel('like',{
				post_id : postModel.id
			});
			if(!postModel.get('current_user_liked')){
				AG.Cloud.Likes.create({
				    post_id : postModel.id
				}, function (e) {
				    if (e.success) {
				        // postModel.set({
				        	// 'current_user_liked' : true,
				        	// 'likes_count' : (postModel.get('likes_count')||0)+1
				        // });
				    } else {
				       // alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
				       postModel.set({
				        	'current_user_liked' : false,
				        	'likes_count' : (postModel.get('likes_count')||1)-1
				        });
				    }
				});
				postModel.set({
		        	'current_user_liked' : true,
		        	'likes_count' : (postModel.get('likes_count')||0)+1
		        });
			}else{
				AG.Cloud.Likes.remove({
				    post_id : postModel.id
				}, function (e) {
				    if (e.success) {
				    } else {
				    	 postModel.set({
				        	'current_user_liked' : true,
				        	'likes_count' : (postModel.get('likes_count')||0)+1
				        });
				       // alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
				    }
				});
				postModel.set({
		        	'current_user_liked' : false,
		        	'likes_count' : (postModel.get('likes_count')||1)-1
		        });
			}
			
		break;
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
	contentItem.properties.canEdit = false;
	// contentItem.photo.height = 180;
	contentItem.like = {
		visible : true
	};
	$.contentSection.setItems([
		contentItem
	]);
}

if(!args.postModel && args.post_id){
	postModel = Alloy.createModel('post', {id:  args.post_id});
}
postModel.on('change',resetPostContent);

// model이 없을 땐 fetch하고 있을땐 바로 resetPostContent호출해서 그려줌
(!args.postModel && args.post_id)?postModel.fetch({
	data : {
		show_user_like : true
	}
}):resetPostContent();


var commentCol = Alloy.createCollection('review');

// TODO:다이나믹 스타일 적용 
var testLabel = Ti.UI.createLabel({
	font : {
		fontSize : 15,
		fontFamily : 'AppleSDGothicNeo-UltraLight'
	}});


var GoogleMapsClass,
	GoogleMaps;
		


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
	
	if( !postModel.get('custom_fields') 
		|| (postModel.get('custom_fields') && !postModel.get('custom_fields').coordinates) ){
		$.listView.deleteSectionAt(1);
		$.listView.insertSectionAt(1,Ti.UI.createListSection());
	}else{
		/**
		 * Google Map
		 */
		if(!GoogleMaps){
			(function(){
				GoogleMapsClass = require('GoogleMaps');
				GoogleMaps = new GoogleMapsClass({
					iOSKey: "***REMOVED***"
				});
				var coord = postModel.get("custom_fields").coordinates;
				var mapView = GoogleMaps.initMap({
					latitude:coord[0][1],
					longitude:coord[0][0],
					zoom: 16, //15, 16이 적당해 보임
					width : 304,
					height : 119,
					top:0,
					userLocation : (Ti.Geolocation.getLocationServicesAuthorization() == Ti.Geolocation.AUTHORIZATION_AUTHORIZED)?true:false
				});
				$.mapWrap.setHeight(119);
				$.mapWrap.add(mapView);
				mapView.backgroundColor = 'white';
				
				var marker1 = GoogleMaps.createMarker({
					latitude:coord[0][1],
					longitude:coord[0][0],
					image: 'images/flag4map' //png 붙이지 마시오. tishadow에서 보려면 파일 변경후 다시 appify해야함
				});
				GoogleMaps.addMarker(marker1);
			})();
		}
	}
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


function fetchComments(options){
	commentCol.fetch({
		data : {
			order : '-created_at',
			post_id : postModel.id,
			per_page : 1000 //TODO : 일단 1000개로 했지만 추후 변경 필요 
		},
		success: function(){
			if( options && options.success){
				options.success();
			}
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

// dialog 및 handler 통합
var STATE_MINE = 'mine',
	STATE_OTHERS = 'others',
	STATE_REPORTED = 'reported',
	OPTION_LABELS = {
		'mine' : {
			options : [L('delete'),L('cancel')],
			destructive : 0,
			cancel : 1
		},
		'others' : {
			options : [L('report'),L('cancel')],
			destructive : 0,
			cancel : 1	
		},
		'reported' : {
			options : [L('unReport'),L('cancel')],
			title : L('unReportDialogTitle'),
			cancel : 1
		}
	},
	reportCol = Alloy.createCollection('report'),
	indi = Ti.UI.createActivityIndicator({
		style: Titanium.UI.iPhone.ActivityIndicatorStyle.DARK,
		indicatorColor : AG.COLORS.lickyRed
	});
	

function showOptionByState(state){
	console.log(OPTION_LABELS[state]);
	$.moreOptionDialog.applyProperties(OPTION_LABELS[state]);
	$.moreOptionDialog.show();
}

$.moreOptionDialog.addEventListener('click', function(e) {
	switch(this.options[e.index]){
		case L('delete'):
			postModel.destroy({
				success:function(e){
					$.postDetail.close();
				},
				error:function(e){
					alert(L("failToDelete"));
				}
			});
		break;
		case L('report'):
			reportCol.create({
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
		break;
		case L('unReport'):
			reportCol.at(0).destroy({
				success: function(e){
					alert(L("successUnReport"));
				},
				error: function(e){
					alert(L("failUnReport"));
				}
			});
		break;
		
		case L('cancel'):
		default :
		break;
	}
});


$.shareButton.addEventListener('click', function(e) {
	// https://github.com/viezel/TiSocial.Framework
	var Social = require('dk.napp.social');
	Social.activityView({
	    text: "먹기전에 Licky! 찰칵!",
	    url: 'http://www.licky.co/post/'+postModel.id,
	    removeIcons:"print,copy,contact,camera,mail,readinglist,airdrop"
	},[
	    
	]);
});


$.moreButton.addEventListener('click', _.throttle(function(e){
	if(postModel.get('user').id === AG.loggedInUser.get('id')){
		showOptionByState(STATE_MINE);
	}else{
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
				$.postDetail.rightNavButton = $.navButtonWrap;
				showOptionByState((reportCol.length > 0)? STATE_REPORTED : STATE_OTHERS);
			},
			error: function(e){
				// alert("networkFailure");
				$.postDetail.rightNavButton = $.navButtonWrap;
			}
		});
	}
},1000));

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
					
					AG.allowPushController.tryRegisterPush({
						title: L('successCommentUpload')
					});
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
	
	// refresh control
	var control = Ti.UI.createRefreshControl({
	    tintColor: args.refreshControlTintColor || Alloy.Globals.COLORS.red
	});
	$.listView.refreshControl = control;
	control.addEventListener('refreshstart', function(e){
		fetchComments({
			success : function(col){
				control.endRefreshing();
			},
			error : function(){
				control.endRefreshing();
			}
			// reset : true
		});
	});
}

function onMapClick(e){
	// alert(e);
}

function hiddenProfileOnLoad(){
	// _.find(this.parent.children,function(proxy){
		// return proxy.bindId === 'profileImage';
	// }).image = this.image;
	this.parent.children[2].image = this.image;
	//TODO : proxy찾는 하드코딩된 부분을 제거
}

function refreshByNotification(e) {
	if( e &&
		e.ndata && 
		e.ndata.pushEvent &&
		e.ndata.pushEvent.data &&
		e.ndata.pushEvent.data.post_id == postModel.id ){
		fetchComments();
	}
}

$.getView().addEventListener('open', function(e) {
	fetchComments();
	
	// 현재 post의 댓글이 추가되었다는 notification을 받았을때 
	AG.notifyController.getView().addEventListener("notifyExpose", refreshByNotification);
});

$.getView().addEventListener('close', function(){
	AG.notifyController.getView().removeEventListener("notifyExpose", refreshByNotification);
});


