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


var commentCol = Alloy.createCollection('review');
commentCol.on('reset',function(col){
	col.each(function(comment){
		Ti.APi.info(comment.attributes);
	});
});
// commentCol.fetch({
	// data : {
		// photo_id : photoModel.id
	// }
// });

// AG.Cloud.Reviews.create({
    // photo_id: '528c6a3f00de2c0b32001120',
    // content: 'Good'
// }, function (e) {
    // if (e.success) {
        // var review = e.reviews[0];
        // alert('Success:\n' +
            // 'id: ' + review.id + '\n' +
            // 'rating: ' + review.rating + '\n' +
            // 'content: ' + review.content + '\n' +
            // 'updated_at: ' + review.updated_at);
    // } else {
        // alert('Error:\n' +
            // ((e.error && e.message) || JSON.stringify(e)));
    // }
// });

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
	$.commentField.value = '';
	doCommentBlur();
});

if(OS_IOS){
	Ti.App.addEventListener('keyboardframechanged', function(e) {
		if(e.keyboardFrame.width==320 && e.keyboardFrame.y<400){ //appear
			$.mainWrap.bottom = e.keyboardFrame.height;
		}else{ //disappear
			
		}
	});
}
