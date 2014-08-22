exports.definition = {
	config: {
		adapter: {
			type: "properties",
			collection_name: "currentPosition"
		}
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
			authorize: function(cb){
				var	self = this;
				
				Ti.Geolocation.getCurrentPosition(function(e){
					self.set('success', e.success);
					self.set('error', e.error);
					self.set(e.coords);
					
					self.trigger('changeGeoAuth');
					cb && cb(e.coords);
				});
			},
			update: function(cb){
				var	self = this;
				
				if( this.get('timestamp') ){
					if( (Date.now() - self.get('timestamp') ) < 5000 ){
						// doCallback(this.attributes);
						cb && cb(self.attributes);
						return;
					}
				}
				self.set('timestamp', Date.now() );

				if( Ti.Geolocation.getLocationServicesAuthorization()
					== Ti.Geolocation.AUTHORIZATION_UNKNOWN ){
					self.set('success', false);
					self.set('error', true);
					// cb & cb();
				}else{
					Ti.Geolocation.getCurrentPosition(function(e){
						self.set('success', e.success);
						self.set('error', e.error);
						self.set(e.coords);
						cb && cb(e.coords);
					});
				}
			}
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