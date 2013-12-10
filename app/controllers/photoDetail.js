var args = arguments[0] || {},
	photoModel = args.photoModel;

var contentItem = photoModel.doDefaultTransform();

contentItem.template = 'photoItemTemplate';
if(OS_IOS){
	contentItem.properties.selectionStyle = Ti.UI.iPhone.ListViewCellSelectionStyle.NONE;
}
contentItem.properties.height = 180;
$.contentSection.setItems([
	contentItem
]);


Ti.API.info(photoModel.attributes);


var commentCol = Alloy.createCollection('review');

var testLabel = Ti.UI.createLabel();
var resetCommentItems = function(){
	var items = [];
	commentCol.each(function(comment){
		Ti.API.info(JSON.stringify(comment.attributes));
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
commentCol.on('add',function(col){
	var items = resetCommentItems();
	
	//TODO : 일단 200을 주었지만 이건 나중에 깔끔한 해결책 찾아야함. reset이 아닌 addItem을 하면 잘 될것 같기도 함.
	// 실제 item이 세팅되기 전에 scrollTo가 실행되어서 ui가 깨짐
	setTimeout(function(){
		$.listView.scrollToItem(1,items.length-1);	
	},200);
});

commentCol.fetch({
	data : {
		photo_id : photoModel.id,
		per_page : 1000 //TODO : 일단 1000개로 했지만 추후 변경 필요 
	}
});

$.commentField.addEventListener('focus', function(e) {
	if(OS_IOS){
		$.mainWrap.animate({
			bottom:216,
			duration : 200
		});
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

$.sendBtn.addEventListener('click', function(e) {
	//alert($.commentField.value);
	$.sendBtn.enabled = false;
	commentCol.create({
		photo_id: photoModel.id,
	    content: $.commentField.value,
	    allow_duplicate : true
	},{
		wait : true, //TODO : wait true하기전에 먼저 보여주고 나중에 update하도록 변경
		success : function(){
			$.commentField.value = '';
			doCommentBlur();
			$.sendBtn.enabled = true;
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
