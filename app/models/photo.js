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
						text : String.format("%.1fkm, %s",
							AG.utils.calculateDistance([
								coordi[0],
								AG.currentPosition.attributes
							]),
							AG.utils.getGoogleShortAddress(
								custom['address_'+(( AG.currentLanguage == 'ko')?'ko':'en')]
							)
						)
					};
				}
				
				Ti.API.info(AG.loggedInUser.toJSON());
				var isMyPhoto = this.get('user').id == AG.loggedInUser.get('id'); 
				
				var commentCountText = "";
				if( this.get('reviews_count') ){
					commentCountText = String.format(' %d', this.get('reviews_count') || 0);
				}
				
				return({
					//template : 'itemTemplate',
					photo : {
						image : urls.original 
					},
					title :{
						text : this.get('title'),
						value : this.get('title')
					},
					userName:{
						text : this.get('user').first_name
					},
					time : {
						text : AG.moment(this.get('created_at')).twitter()
					},
					profileImage : {
						image : profileUrl
					},
					hiddenProfile : {
						image : profileUrl
					},
					commentCount : {
						text : commentCountText
					},
					distance : distance,
					properties :{
						itemId : this.id,
						canEdit : isMyPhoto
					},
				});
			}
		});

		return Model;
	},
	extendCollection: function(Collection) {
		_.extend(Collection.prototype, {
			// comparator : function(modelA, modelB) {
				// if (modelA.get('updated_at') > modelB.get('updated_at')) return -1; // before
				  // if (modelB.get('updated_at') > modelA.get('updated_at')) return 1; // after
				  // return 0; // equal
			// }
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