exports.definition = {
	config: {

		adapter: {
			type: "acs",
			collection_name: "photo",
			idAttribute : 'id',
		},
		
		"settings": {
	        "object_name": "photos", 
	        "object_method": "Photos"
	    }
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
		});

		return Model;
	},
	extendCollection: function(Collection) {
		_.extend(Collection.prototype, {
			// extended functions and properties go here
		});

		return Collection;
	}
};