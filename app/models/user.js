exports.definition = {
	config: {

		adapter: {
			type: "acs",
			collection_name: "user",
			idAttribute : 'id',
		},
		
		"settings": {
	        "object_name": "users", 
	        "object_method": "Users"
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
			
		});

		return Collection;
	}
};