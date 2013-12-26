exports.baseController = 'photoList';
var args = arguments[0] || {};

var photoCol = $.getCollection();

$.afterWindowOpened = function(){
	fetchOnlyFriendsPhoto();
	
	/**
	 * facebook 친구
	 */
	var friendIds = [];
	AG.Cloud.SocialIntegrations.searchFacebookFriends(function (e){
	    if (e.success) {
	        // alert('Success:\n' + 'Count: ' + e.users.length);
	        _.each(e.users,function(user){
	        	friendIds.push(user.id);
	        });
	        fetchOnlyFriendsPhoto(friendIds);
	    } else {
	        // alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
	    }
	});
};

function fetchOnlyFriendsPhoto(userIds) {
	Titanium.Geolocation.getCurrentPosition(function(e){
		if (!e.success || e.error){
			currentLocation.text = 'error: ' + JSON.stringify(e.error);
			Ti.API.info("Code translation: "+translateErrorCode(e.code));
			alert('error ' + JSON.stringify(e.error));
			return;
		}
		
		$.defaultFetchData = {
			where : {
				user_id: {'$in' : userIds}
			}
		};
		photoCol.fetch({
			data : $.defaultFetchData
		});
	});
}


