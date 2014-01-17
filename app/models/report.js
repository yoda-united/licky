exports.definition = {
	config: {
		adapter: {
			type: "acs",
			collection_name: "report"
		},
		settings: {
            "object_name" : "reports",
            "object_method" : "Objects"
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