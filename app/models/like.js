exports.definition = {
	config: {

		adapter: {
			type: "acs",
			collection_name: "review",
			idAttribute : 'id',
		},
		
		"settings": {
	        "object_name": "likes", 
	        "object_method": "Likes"
	    }
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
			doDefaultTransform : function(){
			
			}
		});

		return Model;
	},
	extendCollection: function(Collection) {
		_.extend(Collection.prototype, {
			
		});

		return Collection;
	}
};