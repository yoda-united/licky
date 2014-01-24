function hiddenProfileOnLoad(){
	// _.find(this.parent.children,function(proxy){
		// return proxy.bindId === 'profileImage';
	// }).image = this.image;
	this.parent.children[6].image = this.image;
	//TODO : proxy찾는 하드코딩된 부분을 제거
}
