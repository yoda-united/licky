exports.baseController = 'photoList';

var photoCol = $.getCollection();

$.afterWindowOpened = function(){
	photoCol.fetch({
		data : {
			where : {
				"coordinates":{"$nearSphere":[-122.1, 37.1]}
			}
		}
	});
};


