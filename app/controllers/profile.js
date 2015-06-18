var args = arguments[0] || {}, userModel = args.userModel || AG.loggedInUser;
//init extendEdges
// 원래 tss에서 지정하면 작동해야하는데 안되서 js에서 처리

$.profile.extendEdges = [];




//  ____               ___                  ___    __        ______             ___         
// /\  _`\           /'___\                /\_ \  /\ \__    /\__  _\          /'___\        
// \ \ \/\ \     __ /\ \__/   __     __  __\//\ \ \ \ ,_\   \/_/\ \/     ___ /\ \__/  ___   
//  \ \ \ \ \  /'__`\ \ ,__\/'__`\  /\ \/\ \ \ \ \ \ \ \/      \ \ \   /' _ `\ \ ,__\/ __`\ 
//   \ \ \_\ \/\  __/\ \ \_/\ \L\.\_\ \ \_\ \ \_\ \_\ \ \_      \_\ \__/\ \/\ \ \ \_/\ \L\ \
//    \ \____/\ \____\\ \_\\ \__/.\_\\ \____/ /\____\\ \__\     /\_____\ \_\ \_\ \_\\ \____/
//     \/___/  \/____/ \/_/ \/__/\/_/ \/___/  \/____/ \/__/     \/_____/\/_/\/_/\/_/ \/___/ 
                                                                                         

function updateDefaultInfo(){
	if(userModel){
		var fb_id = userModel.get('external_accounts')[0].external_id;
		$.profileImage.image = String.format("https://graph.facebook.com/%s/picture?width=%d&height=%d", fb_id, 140, 140);
		$.getView().title = $.name.text = userModel.get('first_name');
		$.foodRowLabel.text = String.format(L('someoneLicks'),userModel.get('first_name'));
		$.likeRowLabel.text = String.format(L('someoneLikes'),userModel.get('first_name'));
		
		$.menuTable.deleteRow($.likeRow);
		
		// cover 얻어오는 api가 login이 되어있을때만 가능
		AG.facebook.requestWithGraphPath(fb_id, {
			fields : 'cover'
		}, "GET", function(e) {
			if (e.success) {
				var resultObj = JSON.parse(e.result);
				if(resultObj.cover){
					$.profileBannerImage.image = resultObj.cover.source;
				}
			}
		});
		
		
		var postCol = Alloy.createCollection('post');
		postCol.fetch({
			data : {
				limit : 1,
				where :{
					user_id: {'$in' : [userModel.get('id')]} // !!!
				}
			},
			success : function(col){
				$.foodRowCount.text = col.meta.total_results;
			}
		});
	}
}

//                                
//  __          /'\_/`\           
// /\_\    ____/\      \     __   
// \/\ \  /',__\ \ \__\ \  /'__`\ 
//  \ \ \/\__, `\ \ \_/\ \/\  __/ 
//   \ \_\/\____/\ \_\\ \_\ \____\
//    \/_/\/___/  \/_/ \/_/\/____/
                               

function updateDisplayIfMe(){
	if(! (userModel && userModel.get('id') == AG.loggedInUser.get('id'))){
		return;
	}
	
	$.wireForBtnImg.visible = true;
	$.profileSettingBtn.visible = true;
	$.contactUsBtn.visible = true;
	
	$.menuTable.data = [$.coverRow, $.lickyRow, $.likeRow];
	
	var likeCol = Alloy.createCollection('like');
	likeCol.fetch({
		data : {
			user_id : userModel.get('id'),
			likeable_type : 'Post',
			limit : 1
		},
		success : function(col){
			$.likeRowCount.text = col.meta.total_results;
		}
	});
}



//  __  __              __            __               ____                        ___                         
// /\ \/\ \            /\ \          /\ \__           /\  _`\   __                /\_ \                        
// \ \ \ \ \  _____    \_\ \     __  \ \ ,_\    __    \ \ \/\ \/\_\    ____  _____\//\ \      __     __  __    
//  \ \ \ \ \/\ '__`\  /'_` \  /'__`\ \ \ \/  /'__`\   \ \ \ \ \/\ \  /',__\/\ '__`\\ \ \   /'__`\  /\ \/\ \   
//   \ \ \_\ \ \ \L\ \/\ \L\ \/\ \L\.\_\ \ \_/\  __/    \ \ \_\ \ \ \/\__, `\ \ \L\ \\_\ \_/\ \L\.\_\ \ \_\ \  
//    \ \_____\ \ ,__/\ \___,_\ \__/.\_\\ \__\ \____\    \ \____/\ \_\/\____/\ \ ,__//\____\ \__/.\_\\/`____ \ 
//     \/_____/\ \ \/  \/__,_ /\/__/\/_/ \/__/\/____/     \/___/  \/_/\/___/  \ \ \/ \/____/\/__/\/_/ `/___/> \
//              \ \_\                                                          \ \_\                     /\___/
//               \/_/                                                           \/_/                     \/__/ 

var loginChangeHandler = function(){
	updateDefaultInfo();
	updateDisplayIfMe();
}
AG.settings.on('change:cloudSessionId', loginChangeHandler);
loginChangeHandler(); //initial update

// flush 
$.profile.addEventListener('close',function(){
	AG.settings.off('change:cloudSessionId', loginChangeHandler);
});



//                              __             
//                             /\ \__          
//    __   __  __     __    ___\ \ ,_\   ____  
//  /'__`\/\ \/\ \  /'__`\/' _ `\ \ \/  /',__\ 
// /\  __/\ \ \_/ |/\  __//\ \/\ \ \ \_/\__, `\
// \ \____\\ \___/ \ \____\ \_\ \_\ \__\/\____/
//  \/____/ \/__/   \/____/\/_/\/_/\/__/\/___/ 
                                            

$.menuTable.addEventListener('click', function(e) {
	switch(e.row.id){
		case 'lickyRow':
			AG.utils.openController(AG.mainTabGroup.activeTab,
				 "someonePostList", {
				userModel : userModel
			});
		break;
		case 'likeRow':
			AG.utils.openController(AG.mainTabGroup.activeTab,
				"someonePostList", {
				userModel : userModel,
				likedPostOnly : true
			});
		break;
	}
});

$.contactUsBtn.addEventListener('click', function(e) {
	
	var phoneInfo = {
		platform : Ti.Platform.model,
		osVersion : Ti.Platform.version,
		locale : Ti.Platform.locale,
		appId : Ti.App.id,
		appVersion : Ti.App.version
	};
	
	var bodyString='<br/><br/> <strong>* '+L('userEnvironment') + '*</strong><br/>';
	_.each(phoneInfo,function(value,key){
		bodyString+=String.format("<strong>%s</strong> : %s<br/>",key,value);
	});
	var emailDialog = Ti.UI.createEmailDialog({
		subject : L('mailSubject'),
		toRecipients : ['sup@licky.co'],
		messageBody : bodyString,
		barColor : '#3498db',
		html : true
	});
	
	if(!emailDialog.isSupported()){
		alert(L('notSupportEmail'));
		Ti.UI.Clipboard.setText('sup@licky.co');
	} else {
		emailDialog.open();
	}	
});


$.profileSettingBtn.addEventListener('click', function(e) {
	$.settingDialog.show();
});

$.settingDialog.addEventListener('click', _.throttle(function(e) {
	if (e.index === 0) {
		// AG.settings.get('cloudSessionId') ? AG.loginController.logout() : AG.loginController.requireLogin();
		AG.loginController.logout(function(e){
			AG.mainTabGroup.setActiveTab(0);
		});
	}
},1000));
