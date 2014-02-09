exports.definition = {
	config: {
		adapter: {
			type: "properties",
			collection_name: "settings"
		}
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			defaults : {
				id : 'staticSettings' //id를 고정하여 id 지정 없이 singleton을 사용 가능하게 함
			}
			// extended functions and properties go here
		});

		return Model;
	},
	extendCollection: function(Collection) {
		_.extend(Collection.prototype, {
			// extended functions and properties go here
			 /**
		     * clean up any models from the properties db
		     */
		    cleanup : function() {
		        var regex = new RegExp("^(" + this.config.adapter.collection_name + ")\\-(.+)$");
		        var TAP = Ti.App.Properties;
		        _.each(TAP.listProperties(), function(prop) {
		            var match = prop.match(regex);
		            if (match) {
		                TAP.removeProperty(prop);
		                Ti.API.info('deleting old model ' + prop);
		            }
		        });
		    }
		});

		return Collection;
	}
};