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
			doDefaultTransform : function(){
				var urls = this.get('urls');
				var profileUrl = 
					String.format("https://graph.facebook.com/%s/picture?width=%d&height=%d",
								this.get('user').external_accounts[0].external_id,
								80,
								80);
								
				var custom = this.get("custom_fields");
				var coordi = custom && custom.coordinates;
				
				var distance;
				if(coordi) {
					distance = {
						text : String.format("%.2fkm",AG.utils.calculateDistance([
							coordi[0],
							AG.currentPosition.attributes
						]))
					};
				}
				return({
					//template : 'itemTemplate',
					photo : {
						image : urls.medium_640 || urls.original 
					},
					title :{
						text : this.get('title'),
						value : this.get('title')
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
					commentCount : {
						text : String.format('댓글 %d',this.get('reviews_count') || 0)
					},
					distance : distance,
					properties :{
						itemId : this.id
					},
				});
			}
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