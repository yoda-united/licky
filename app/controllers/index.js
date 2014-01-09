// 최상위 요소는 컨트롤러이름으로 아이디가 지정되는걸 이용하는 방식으로 돌아감 
AG.mainTabGroup = $.index;
$.index.open();
// AG.mainTabGroup = $.mainTabGroup;
// AG.mainTabGroup.open();
// $.getView().add(Alloy.createController('cameraOveray').getView());


$.meTab.addEventListener('focus', function(e){
	$.profile.setProperties();
});