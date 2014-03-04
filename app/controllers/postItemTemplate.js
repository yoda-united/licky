function hiddenProfileOnLoad(){
	// _.find(this.parent.children,function(proxy){
		// return proxy.bindId === 'profileImage';
	// }).image = this.image;
	this.parent.children[6].image = this.image;
	this.parent.children[6].mask = 'images/profileMask.png';
	// this.parent.children[6].mode = Ti.UI.iOS.BLEND_MODE_SOURCE_IN;
	//TODO : proxy찾는 하드코딩된 부분을 제거
}
