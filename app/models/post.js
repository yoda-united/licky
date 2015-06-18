exports.definition = {
	config: {

		adapter: {
			type: "acs",
			collection_name: "post",
			idAttribute : 'id',
		},
		
		"settings": {
	        "object_name": "posts", 
	        "object_method": "Posts"
	    }
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
			doDefaultTransform : function(){
				
				var urls = this.get('photo') && this.get('photo').urls || {}, 
					profileUrl = String.format("https://graph.facebook.com/%s/picture?width=%d&height=%d", this.get('user').external_accounts[0].external_id, 80, 80),
					custom = this.get("custom_fields"),
					coordi = custom && custom.coordinates,
					venue_name = custom && (custom.venue_name || custom.foursquare_venue_name ),
					distance;
					
				if(coordi) {
					distance = {
						text : 
							(AG.currentPosition.get('accuracy') ? 
								String.format("%.1fkm", AG.utils.calculateDistance([coordi[0],	AG.currentPosition.attributes])) + ': ' 
								: ""
							) 
							+ (venue_name ? venue_name+", " : "") 
							+ AG.utils.getGoogleShortAddress(
								custom['address_'+(( AG.currentLanguage == 'ko')?'ko':'en')]
							)
					};
				}else{
					distance = {
						text: venue_name
					};
				}
				
				var isMine = this.get('user').id == AG.loggedInUser.get('id'); 
				
				var likeIcon = this.get('current_user_liked')?
					{
						text : '\uf1e0', //iconic star
						color : AG.COLORS.red
					}:{
						// text : '\uf1df ',
						text: '\uf1e0',
						color : '#eddd'
					};
				
				// BOG-196 관련 임시 조치
				this.cachedBlob = this.cachedBlob || this.collection?this.collection.recentBlob:'';
				this.collection && (this.collection.recentBlob = null);
				/////////////////////
				
				return({
					//template : 'itemTemplate',
					photo : {
						image : urls.original || this.cachedBlob
 
						// backgroundLeftCap : 0,
						// backgroundTopCap: 0,
						// backgroundRepeat : true,
						// backgroundImage : urls.original 
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
						text : this.get('reviews_count')? "\uf11f " + this.get('reviews_count') : ""
					},
					distance : distance,
					likeCount : {
						text : this.get('likes_count')? "\uf1e0 " + this.get('likes_count') : ""
					},
					likeIcon : likeIcon,
					likeText : this.get('current_user_liked')?
						{
							text: " "+L('liked')
						}:
						{
							text: " " +L('like')
						},
					properties :{
						// backgroundRepeat : true,
						// backgroundImage : urls.original ,
						itemId : this.id,
						canEdit : isMine
					},
				});
			},
			// 포스트 삭제하면 업로드된 사진들과 커맨트들을 slimer에서 삭제
			alterSyncRemove: function(params, callback){
				// alert(this.get('photo'));
// 				
				// return;
				params.photo_id = this.get('photo').id;
				var url = AG.slimer.URL + "/api/acs/Posts/" + params.post_id;
				var client = Ti.Network.createHTTPClient({
					onload: function(e){
						callback(JSON.parse(this.responseText));
					},
					onerror: function(e){
						Ti.API.debug(e.error);
						alert(L('failToDeletePost'));
					},
					timeout: 5000
				});
				client.open("DELETE", url);
				client.setRequestHeader("Cookie", "_session_id=" + AG.Cloud.sessionId);
				client.send(params);
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
				options.data = _.deepExtend(options.data || {}, this.defaultFetchData);
				Backbone.Collection.prototype.fetch.call(this, options);
			}
		});

		return Collection;
	}
};
