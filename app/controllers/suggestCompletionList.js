var args = arguments[0] || {};

var bottom_up = 260,
	bottom_down = 95;

var venues = [],	// 결
	position,	// 검색할 위
	textField;	// 자동완성할 텍스트 필


// venue is array
var showShopNameGuidance = function(venues){
	// if(!venues || venues.length == 0 ){
	if(!venues ){
		return;
	}
	// alert($.shopNameSuggestList.getHeight());
	$.suggestCompletionList.animate({
		// duration: 10,
		// height: 1
		duration: 240,
		bottom: bottom_down
	}, function(){
		if( venues.length == 0){
			hideShopNameGuidance();
			return;
		}
		$.suggestCompletionList.setHeight(30 * venues.length);
		$.suggestCompletionList.animate({
			duration: 240,
			bottom: bottom_up
		});
	});
	var items = [];
	_.each(venues, function(venue){
		items.push({
			properties:{
				itemId : venue.id
			},
			name: {
				text: " "+venue.name+ " "
			}
		});
	});
	var section = Ti.UI.createListSection({
		items: items
	});
	$.suggestCompletionList.replaceSectionAt(0, section,{
		animated: false
	});
};
var hideShopNameGuidance = function(){
	$.suggestCompletionList.animate({
		duration: 240,
		bottom: bottom_down
	});
};
var suggestCompletionShopName = _.throttle(function(options){
	var query = options.query,
		currentPosition = options.position || position;
	// alert(query+"\n"	+ JSON.stringify(currentPosition));

	if( query.length < 3 ){
		return;
	}

	var url = "https://api.foursquare.com/v2/venues/suggestcompletion"
	// var url = "https://api.foursquare.com/v2/venues/explore"
	// var url = "https://api.foursquare.com/v2/venues/search"
		// params
		+"?client_id=EJDKZREE2GSE31ZCWQUKPLVMFEQUINI0DT4A2V20XE21ZQ02&client_secret=NP5ZRYKNDKZC2CPBAC2KZDQLUOMSHT1FVTVZCF0SSRCWBOLH&v=20140310"
		// +"&categoryId=4d4b7105d754a06374d81259"	// for search api
		// +"&section=food"	// for explore api
		+"&limit=5"	// max 100
		+"&ll="+currentPosition.latitude+","+currentPosition.longitude+"&query="+ query;
	

	var client = Ti.Network.createHTTPClient({
		// function called when the response data is available
		onload : function(e) {
			// Ti.API.info("----Received text from Foursquare------- ");
			var res = JSON.parse(this.responseText);
			if( res && res.meta && res.meta.code === 200 ){
				venues = res.response.minivenues;
				showShopNameGuidance(venues);
			}
		},
		// function called when an error occurs, including a timeout
		onerror : function(e) {
			Ti.API.info("----Received text from Foursquare:error-----");
			Ti.API.info(JSON.parse(this.responseText));
			Ti.API.debug(e.error);
		},
		timeout : 5000 // in milliseconds
	});
	client.open("GET", url);
	client.send();
}, 300);

$.suggestCompletionList.addEventListener('itemclick', function(e){
	hideShopNameGuidance();
	// alert(e.itemId);
	for(var i = 0; i < venues.length; i++){
		if( venues[i].id == e.itemId ){
			textField.setValue(venues[i].name);
		}
	}
	textField.fireEvent('suggestComplete', e);
});


exports.query = function(options){
	suggestCompletionShopName({
		query: options.query,
		position: options.position
	});
};
exports.hide = function(){
	hideShopNameGuidance();
};
exports.show = function(){
	showShopNameGuidance(venues);
};

// 이것만 셋팅 해 놓으면 됨 
exports.setProps = function(options){
	position = options.position;
	textField = options.textField;
	
	textField.addEventListener('change', _.debounce(function(){
		suggestCompletionShopName({
			query: textField.getValue(),
			position: position
		});
	}, 220));
	textField.addEventListener('focus', function(){
		showShopNameGuidance(venues);
	});
	textField.addEventListener('blur', function(){
		hideShopNameGuidance();
	});
	
	
};

