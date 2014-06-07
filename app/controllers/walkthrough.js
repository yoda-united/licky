var args = arguments[0] || {};


$.step03Button.addEventListener('click', function(){
	AG.settings.save('isWalkthroughMaster', true);
	$.walkthrough.close();
});

$.scrollableView.addEventListener('scrollend', function(e){
	// 3 페이지 일때 
	if( e.currentPage == 2	) {
		// $.step03Button.setVisible(true);
		$.stilImage2.animate({
			opacity: 1.0,
			delay: 600,
			curve: Ti.UI.ANIMATION_CURVE_EASE_OUT,
			duration: 400
		});
		$.step03Button.animate({
			opacity: 1.0,
			delay: 600,
			curve: Ti.UI.ANIMATION_CURVE_EASE_OUT,
			duration: 400
		});
	}else{
		$.step03Button.setOpacity(0);
		$.stilImage2.animate({
			opacity: 0.0,
			delay: 0,
			curve: Ti.UI.ANIMATION_CURVE_EASE_OUT,
			duration: 200
		});
	}
});
