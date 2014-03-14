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
				var isMine = this.get('user').id == AG.loggedInUser.get('id');
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
			},
			// 댓글 쓸땐 slimer로 요청해서 추가적인 작업이 필요(push noti)
			alterSyncCreate: function(params,callback){
				//httpClient params를 넘기고
				// var url = "http://192.168.0.50:8080/api/acs/"+exports.definition.config.setttings.object_method;
				var url = AG.slimer.URL + "/api/acs/Reviews";
				
				var client = Ti.Network.createHTTPClient({
					// function called when the response data is available
					onload : function(e) {
						Ti.API.info("Received text: " + this.responseText);
						//alert('success');
						callback(JSON.parse(this.responseText));
					},
					// function called when an error occurs, including a timeout
					onerror : function(e) {
						Ti.API.debug(e.error);
						alert('error');
					},
					timeout : 5000 // in milliseconds
				});
				// Prepare the connection.
				client.open("POST", url);
				// Send the request.
				client.setRequestHeader("Cookie", "_session_id=" + AG.Cloud.sessionId);
				client.send(params);
			}
		});

		return Model;
	},
	extendCollection: function(Collection) {
		_.extend(Collection.prototype, {
			comparator : function(modelA, modelB) {
				if (modelA.get('created_at') > modelB.get('created_at')) return 1; // before
				  if (modelB.get('created_at') > modelA.get('created_at')) return -1; // after
				  return 0; // equal
			}
			// create: function(model,options) {
				// var coll = this;
				// options = options ? _.clone(options) : {};
				// model = this._prepareModel(model, options);
				// if (!model)
					// return false;
				// if (!options.wait)
					// coll.add(model, options);
				// var success = options.success;
				// options.success = function(nextModel, resp, xhr) {
					// if (options.wait)
						// coll.add(nextModel, options);
					// if (success) {
						// success(nextModel, resp);
					// } else {
						// nextModel.trigger('sync', model, resp, options);
					// }
				// };
// 				
				// //model.save(null, options);
// 				
// 				
				// return model;
			// }

		});

		return Collection;
	}
};