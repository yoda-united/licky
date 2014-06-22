// 최상위 요소는 컨트롤러이름으로 아이디가 지정되는걸 이용하는 방식으로 돌아감 
AG.mainTabGroup = $.index;
$.index.open();


$.index.addEventListener('focus', function(e){
	var prevTabIndex = e.previousIndex;
	
	if(e.tab.title === $.meTab.title || e.tab.title === $.pushTab.title){
		AG.loginController.requireLogin({
			success: function(){
			},
			cancel: function(){
				$.index.setActiveTab(prevTabIndex);
			}
		});
	};
	
	if(e.tab.title === $.nearTab.title){
		// if( !AG.currentPosition.get('accuracy') ){
		AG.currentPosition.update( function(){
			if( !AG.currentPosition.get('success') ){
				var dialog = Ti.UI.createAlertDialog({
				    message: L('locationServiceNeeded'),
				    ok: L('OK'),
				    title: L('notice')
				  });
				dialog.addEventListener('click', function(){
					$.index.setActiveTab(prevTabIndex);
				});
				dialog.show();
			}
		});
		// }
	}
});

AG.mainTabGroup.add( AG.notifyController.getView() );
// AG.notifyController.push({
	// message: "hello"
// });
// AG.notifyController.push({
	// message: "fucking"
// });
// AG.notifyController.push({
	// message: "world"
// });

$.pushTab.setBadge( Ti.UI.iPhone.getAppBadge() || null );

Ti.App.addEventListener('changeBadge', function(e){
	$.pushTab.setBadge(e.number || null);
});

/* x-callback-url */
if( OS_IOS ){
	var doUrlScheme = function(){
		var url = Ti.App.getArguments().url;
		// url = "licky://post/53a5338ec270f264ca00293f?asdf=as";
		if( url ){
			var reg = /^(.*):\/\/post\/(\w*)/i;
			var match = reg.exec(url);
			// alert( JSON.stringify(match[2]) );
			if( match[2] ){
				AG.utils.openController(AG.mainTabGroup.activeTab, 'postDetail', {
					post_id: match[2]
				});
			}
		}
	};
	doUrlScheme();
	Ti.App.addEventListener('resumed', doUrlScheme);
}


