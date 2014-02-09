exports.definition = {
	config: {
		adapter: {
			type: "properties",
			collection_name: "loggedInUser"
		}
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			/**
			 * Backbone의 경우 idAttribute는 model에 extend를 통해 바로 넣는다.
			 * Alloy의 경우 adapter에 넣고 adapter가 model에 넣어준다.
			 * 그런데 properties 아답터는 model에 idAttribute를 넣는 코드가 없다. (3.2.0.GA)
			 * 
			 */
			idAttribute : 'bogoyoLoggedInUser',
			defaults :{
				bogoyoLoggedInUser : 'staticId'
			},
			clearWithoutId : function(options) {
		      this.clear();
		      return this.set('bogoyoLoggedInUser','staticId');
		    },
			getProfileImageUrl : function(){
				return String.format("https://graph.facebook.com/%s/picture?width=%d&height=%d",
							this.get('external_accounts')[0].external_id,
							80,
							80);
			}
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