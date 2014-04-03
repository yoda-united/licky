exports.baseController = 'postList';
$.getView().title=L('nearList');

$.onFirstFocus = function(){
	$.listViewC.listView.contentTopOffset = -19;
	$.listViewC.listView.visible=true;
	fetchByCurrentPosition();
};

function fetchByCurrentPosition(){
	AG.currentPosition.update( function(e){
		$.fetchWhereData = {
			"coordinates":{
				"$nearSphere": [AG.currentPosition.get('longitude'), 
							AG.currentPosition.get('latitude') ]
				//"$maxDistance" : 1000/6371 // km/6371 or mile/3959 )
			 }
		};
		
		$.fetchFirstCollection();			
	});
}


