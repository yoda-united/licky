$.loginBtn.addEventListener('click', function(e) {
	AG.settings.get('cloudSessionId')?
	AG.loginController.logout():AG.loginController.requireLogin();
	
});

//로그인 상태 변경시
AG.settings.on('change:cloudSessionId',loginChangeHandler);

//로그인된 사용자 모델(local에 저장한 properties model) 변경시
AG.loggedInUser.on('change',function(model){
	
});

function loginChangeHandler(){
	// 최초에 이미 로그인 되어 있을 경우에 대한 처리
	if(AG.isLogIn()){
		$.resetClass($.loginBtn,'afterLogin');
	}else{
		$.resetClass($.loginBtn,'beforeLogin');
	}
}

loginChangeHandler();

