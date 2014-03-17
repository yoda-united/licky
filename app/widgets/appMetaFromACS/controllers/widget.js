var Cloud = require('ti.cloud');

exports.fetch = function(args){
	args = args || {};
	var success = args.success,
		cancel = args.cancel,
		error = args.error;
	
	var appMeta = {
		osname : Ti.Platform.osname,
		model : Ti.Platform.model,
		osVersion : versionStringToNumber(Ti.Platform.version),
		locale : Ti.Platform.locale,
		appId : Ti.App.id,
		appVersion : versionStringToNumber(Ti.App.version)
	};
	
	Cloud.KeyValues.get({
	    name: 'appMetaV1.1'
	}, function (e) {
	    if (e.success) {
	    	
	    	// version 비교를 위해
	    	// 숫자로 변환 v1.v2.v3
	    	// v1 + 0.0001 * v2 + 0.00000001*v3
	        var keyvalue = e.keyvalues[0],
	        	metaInfo = JSON.parse(keyvalue.value).data;
				Ti.App.Properties.setObject('appMetaFromACS',metaInfo);
			
			// alert(typeof appMeta.appVersion);
			// 서버에서 "0.8.2" 형태로 적었을 때는 아래를 실행해야함
			// _.each(metaInfo,function(queryItems){
				// _.each(['osVersion','appVersion'],function(versionName){
					// _.each(queryItems.query[versionName] || [],function(value,key){
						// queryItems.query[versionName][key] =  versionStringToNumber(value);
					// });
				// });
			// });
			
			_.each(metaInfo, function(queryItems){
				var queryFun = require(WPATH('underscore-query'))(_,false); //notMix
				var result = queryFun([appMeta],queryItems.query) || [];
				// alert(result);
				if(result.length){
					//do Action
					var a = Ti.UI.createAlertDialog({
						title : queryItems.title,
						message : queryItems.message,
						buttonNames : queryItems.buttonNames || [L('cancel','Cancel'), L('go','Go')],
						cancel : queryItems.cancel || 0
					});
		            a.addEventListener('click', function(e)
                    {
                        if(e.index!==queryItems.cancel){
                            if(Ti.Platform.canOpenURL(queryItems.url)){
                                Ti.Platform.openURL(queryItems.url);
                            }
                        }
                    });
                    a.show();
				}
			});
			
	    } else {
	    	//error
	    	_.isFunction(error) && error();
	    }
	});
};

function versionStringToNumber(str){
	str = str +'';
	var multiNum = [1, 0.0001, 0.00000001],
		versionNum = 0;
		
	_.each(str.split('.'),function(v,index){
		versionNum += parseInt(v)*multiNum[index];
	});
	
	return versionNum;
}