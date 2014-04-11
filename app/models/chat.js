exports.definition = {
	config: {

		adapter: {
			type: "acs",
			collection_name: "chat",
			idAttribute : 'id',
		},
		"settings": {
	        "object_name": "chats", 
	        "object_method": "Chats"
	    }
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
			doDefaultTransform : function(){
				console.log(this.get('message'));
				var message = this.get('message');
				var payloadObj;
				try {
				   payloadObj = JSON.parse(message);
				}
				catch (e) {
				   return null;
				}
				
				return (this.get('from').id == AG.loggedInUser.get('id'))?{properties:{height:0}}:{
					template : 'pushItemTemplate',
					title : {
						text: JSON.parse(message).alert
					},
					photo : {
						image : payloadObj.photo_urls.original
					},
					profile : {
						image : String.format("https://graph.facebook.com/%s/picture?width=%d&height=%d", payloadObj.user.external_accounts[0].external_id, 128, 128),
					},
					userName : {
						text : payloadObj.user.frist_name + ' ' + payloadObj.user.last_name
					},
					date : {
						text : AG.moment(this.get('created_at')).twitter()
					},
					properties : {
						itemId : this.id
					}
				};
			}
		});

		return Model;
	},
	extendCollection: function(Collection) {
		_.extend(Collection.prototype, {
			// extended functions and properties go here
			defaultFetchData : {},
			fetch: function(options){
				options = options || {};
				options.data = _.extend(options.data || {}, this.defaultFetchData);
				Backbone.Collection.prototype.fetch.call(this, options);
			}
		});

		return Collection;
	}
};