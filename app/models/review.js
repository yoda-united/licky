exports.definition = {
	config: {

		adapter: {
			type: "acs",
			collection_name: "review",
			idAttribute : 'id',
		},
		
		"settings": {
	        "object_name": "reviews", 
	        "object_method": "Reviews"
	    }
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
			doDefaultTransform : function(){
				var profileUrl = 
					String.format("https://graph.facebook.com/%s/picture?width=%d&height=%d",
								this.get('user').external_accounts[0].external_id,
								80,
								80);
				var isMine = this.get('user').id == AG.loggedInUser.id;
				return({
					//template : 'itemTemplate',
					content :{
						text : this.get('content')
					},
					userName:{
						text : this.get('user').first_name
					},
					time : {
						text : AG.moment(this.get('created_at')).fromNow()
					},
					profileImage : {
						image : profileUrl
					},
					hiddenProfile : {
						image : profileUrl
					},
					properties :{
						itemId : this.id,
						canEdit : isMine
					},
				});
			}
		});

		return Model;
	},
	extendCollection: function(Collection) {
		_.extend(Collection.prototype, {
			comparator : function(modelA, modelB) {
				if (modelA.get('updated_at') > modelB.get('updated_at')) return 1; // before
				  if (modelB.get('updated_at') > modelA.get('updated_at')) return -1; // after
				  return 0; // equal
			}
		});

		return Collection;
	}
};