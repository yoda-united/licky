exports.definition = {
	config: {
		'adapter': {
			type: "acs",
			collection_name: "report"
		},
		'settings': {
            object_name : "reports",
            object_method : "Objects"
	    }
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
			/*
			isReported: function( options ){
				var options = options || {}
					,post_id = options.post_id;
				
				this.fetch({
					data:{
						class_name: "reports",
						response_json_depth : 1,
						where: {
							user_id: AG.loggedInUser.get('id'),
							fields:{target_post_id: post_id}
						},
						limit:1
					},
					success: function(m, res){
						if( res.length > 0 ){
							options.success && options.success(true);
						}else {
							options.success && options.success(false);
						}
					},
					error: function(e){
						options.error && options.error(e);
					}
				});
			}
			*/
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