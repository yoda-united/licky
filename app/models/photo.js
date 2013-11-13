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
			comparator : function(modelA, modelB) {
				if (modelA.get('updated_at') > modelB.get('updated_at')) return -1; // before
				  if (modelB.get('updated_at') > modelA.get('updated_at')) return 1; // after
				  return 0; // equal
			}
		});

		return Collection;
	}
};