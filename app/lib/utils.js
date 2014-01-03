Number.prototype.toDeg = function() {
    return this * 180 / Math.PI;
};
Number.prototype.toRad = function() {
    return this * Math.PI / 180;
};

exports.calculateDistance = function(args,type){
	if(!args.length || args.length<2 || !args[1].latitude) return 0;
	
	var lat1,lon1,lat2,lon2;
	lat1= args[0].latitude || args[0][1]; //40.28;
	lon1= args[0].longitude || args[0][0]; //-74.82;
	lat2= args[1].latitude || args[1][1]; //40.17;
	lon2= args[1].longitude || args[1][0]; //-47.12;
	
	var R = 6371; // km
	var dLat = (lat2-lat1).toRad();
	var dLon = (lon2-lon1).toRad();
	var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
	Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) *
	Math.sin(dLon/2) * Math.sin(dLon/2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	var d = R * c;
	
	if(type == 'mile'){
		Ti.API.debug("km " + d);
		//Ti.API.debug("km " + d);
		return d;
	}else{
		// Ti.API.debug("miles " + d/1.609344);
		return d/1.609344;
	}
};


/**
 * A cross platform navigation group opener
 * @param {Object} navGroup
 * @param {Object} controllerName
 * @param {Object} controllerArgument
 */
exports.openController = function(navGroup,name,args){
	var w=Alloy.createController(name,args).getView();
	if (OS_ANDROID){
		w.addEventListener('open',function(e){
			if (! w.getActivity()) {
	            Ti.API.error("Can't access action bar on a lightweight window.");
	        } else {
	            actionBar = w.activity.actionBar;
	            if (actionBar) {
	                actionBar.displayHomeAsUp=true;
	                actionBar.onHomeIconItemSelected = function() {
	                    w.close();
	                };
	            }
	            w.activity.invalidateOptionsMenu();
	        }
		});
		w.open();
	}else{
		navGroup.open(w,{animated:true});
	}
};

   
exports.getShortAddress = function(p,localeOnly){
	if(!p) {
		return '';
	}
	var results = [];
	_.each(['street','city','country_code'],function(key){
		if(p[key]){
			results.push(p[key].replace(' (','('));
		}
	});
	
	var resultStr = results.join(' ');
	
	return (localeOnly)?resultStr.replace(/\(.*?\)/ig,''):resultStr;
};

exports.getGoogleShortAddress = function(add){
	if(!add) return '';
	
	// var add = add;address[0];
	// var resultArray = _.map(add.address_components,function(item){
		// return item.short_name;
	// });
	
	var resultArray = [];
	_.each(add.address_components,function(item){
		if(_.contains(item.types,'sublocality') || _.contains(item.types,'locality')){
			resultArray.push(item.short_name);
		}
	});
	
	return resultArray.join(', ');
};

exports.googleReverseGeo = function(args){
	args = args || {};
	
	// Create an HTTPClient.
	var anXhr = Ti.Network.createHTTPClient();
	anXhr.setTimeout(10000);
	
	// Define the HTTPClient callbacks.
	anXhr.onload = function() {
		if (this.status === 200) {
			args.success && args.success(JSON.parse(this.responseText));
		} else {
			args.error && args.error(this);
		}
	};
	anXhr.onerror = function() {
		args.error && args.error(this);
	};
	
	var param = String.format('latlng=%.20f,%.20f&sensor=true',args.latitude,args.longitude);

	// Send the request for binary data.
	anXhr.open('GET', 'http://maps.googleapis.com/maps/api/geocode/json?'+param);
	anXhr.setRequestHeader("Accept-Language", args.locale);
	anXhr.send();
	
};
