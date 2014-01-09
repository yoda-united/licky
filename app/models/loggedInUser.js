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
			updateFbUserData: function(){
				//http call
				
				
				// Create an HTTPClient.
				var anXhr = Ti.Network.createHTTPClient();
				anXhr.setTimeout(10000);
				
				// Define the callback.
				anXhr.onload = function() {
					// Handle the XML data.
					var result = this.responseText;
					//result parse  해서 this.save('fbUserData',parseResult);
				};				
				// Send the request data.
				anXhr.open('GET','http://twitter.com/statuses/show/123.xml');
				anXhr.send();
				
					
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