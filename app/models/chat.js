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
				// Ti.API.info("===========");
				// Ti.API.info(JSON.stringify(this.attributes));
				// Ti.API.info("===========");
				// console.log(this.get('message'));
				var custom_fields = this.get('custom_fields');
				var payloadObj = {};
				try {
				   payloadObj = JSON.parse( this.get('message') );
				}
				catch (e) {
				   return null;
				}
				// Ti.API.info(payloadObj);
				return {
					template : 'pushItemTemplate',
					title : {
						text: (custom_fields.type==='COMMENT')
							?this.get('from').first_name+ " left a comment on your licky: " + custom_fields.contents
							:payloadObj.alert
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
					photoTitle : {
						text : payloadObj.post_title?'@ ' + payloadObj.post_title:''
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