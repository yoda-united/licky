exports.definition = {
	config: {
		adapter: {
			type: "acs",
			collection_name: "file",
			idAttribute : 'id',
		},
		
		"settings": {
	        "object_name": "files", 
	        "object_method": "Files"
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