var args = arguments[0] || {};

$.step03Button.addEventListener('click', function(){
	AG.settings.save('isWalkthroughMaster', true);
	$.walkthrough.close();
});

$.step02Label.attributedString = Ti.UI.createAttributedString({
    text: L('step2_takePic'),
    attributes: [
        {
            type: Titanium.UI.iOS.ATTRIBUTE_FOREGROUND_COLOR,
            value: AG.COLORS.lickyRed,
            range: [L('step2_takePic').indexOf('Licky'),'Licky'.length]
        }
    ]
});;

$.scrollableView.addEventListener('scrollend', function(e){
	// if( e.currentPage == 1){
		// var t1 = Ti.UI.create3DMatrix();
		  // t1 = t1.translate(0, 100, 200);
		  // t1.m34 = 1.0/-90;
		// $.welcomeLabel.animate({
			// transform: t1
			// transition: Ti.UI.iPhone.AnimationStyle.CURL_UP 
		// });
	// }
	// 3 페이지 일때 
	if( e.currentPage == 2	) {
		// $.step03Button.setVisible(true);
		$.stilImage2.animate({
			opacity: 1.0,
			delay: 100,
			curve: Ti.UI.ANIMATION_CURVE_EASE_OUT,
			duration: 400
		});
		$.step03Button.animate({
			opacity: 1.0,
			delay: 400,
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
