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
			update: function(cb){
				var	self = this;
				
				if( this.get('timestamp') ){
					if( (Date.now() - self.get('timestamp') ) < 5000 ){
						// doCallback(this.attributes);
						cb && cb();
						return;
					}
				}
				self.set('timestamp', Date.now() );
									
				Ti.Geolocation.getCurrentPosition(function(e){
					self.set('success', e.success);
					self.set('error', e.error);
					self.set(e.coords);
					cb && cb();
				});
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