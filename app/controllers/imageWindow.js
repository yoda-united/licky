var args = arguments[0] || {},
	imageUrl =  args.imageUrl;
	
if( imageUrl ){
	$.mainImageView.setImage( imageUrl );
}

$.activityIndicator.show();

$.imageWindow.addEventListener('click', function(){
	$.containScrollView.animate({
		opacity: 0,
		duration: 150
	}, function(){
		$.imageWindow.close({
			animated: false
		});
	});
});

$.getView().addEventListener("open", function(){
	$.containScrollView.animate({
		opacity:1,
		duration: 200
	});
});
