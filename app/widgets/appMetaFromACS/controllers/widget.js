var metaInfo;
var Cloud = require('ti.cloud');

exports.updateAppMeta = function(args){
	args = args || {};
	var success = args.success,
		error = args.error;
	
	Cloud.KeyValues.get({
	    name: 'appMeta'
	}, function (e) {
	    if (e.success) {
	        var keyvalue = e.keyvalues[0];
	        metaInfo = JSON.parse(keyvalue.value);
	        Ti.App.Properties.setObject('appMetaFromACS',metaInfo);
	        
	        
	        if(!args.silent){
		        //version
		        var versionInfo = metaInfo.versionInfo;
		        if(versionInfo){
			        var curVersion = Ti.App.version;
			        var latestVersion = (OS_IOS)?versionInfo.iOS:versionInfo.android;
			        Ti.API.info(curVersion, latestVersion);
			        if(versionCompare(curVersion, latestVersion) < 0){
			            var a = Ti.UI.createAlertDialog();
			            a.addEventListener('click', function(e)
	                    {
	                            var targetUrl = (OS_IOS)?"https://itunes.apple.com/kr/app/id699601180":
	                                                            "https://play.google.com/store"; //TODO:주소 변경하기
	                            targetUrl = versionInfo['targetUrl_'+Ti.Platform.osname] || targetUrl; 
	                            if(e.index===1){
	                                    Ti.API.info(targetUrl);
	                                    Ti.Platform.openURL(targetUrl);
	                            }
	                    });
			            a.message = versionInfo.message || 'New Version Release!';
	                    a.buttonNames = [L('cancel','Cancel'),versionInfo.buttonLabel || 'GO'];
	                    a.cancel = 0;
	                    a.show();
			        }
		        }
	        }
	        
	        _.isFunction(success) && success(metaInfo);
	    } else {
	    	//error
	    	_.isFunction(error) && error();
	    }
	});
};

/**
 * Simply compares two string version values.
 * 
 * https://gist.github.com/1115557
 * 
 * Example:
 * versionCompare('1.1', '1.2') => -1
 * versionCompare('1.1', '1.1') =>  0
 * versionCompare('1.2', '1.1') =>  1
 * versionCompare('2.23.3', '2.22.3') => 1
 * 
 * Returns:
 * -1 = left is LOWER than right
 *  0 = they are equal
 *  1 = left is GREATER = right is LOWER
 *  And FALSE if one of input versions are not valid
 *
 * @function
 * @param {String} left  Version #1
 * @param {String} right Version #2
 * @return {Integer|Boolean}
 * @author Alexey Bass (albass)
 * @since 2011-07-14
 */
 function versionCompare(left, right) {
    if (typeof left + typeof right != 'stringstring')
        return false;
    
    var a = left.split('.')
    ,   b = right.split('.')
    ,   i = 0, len = Math.max(a.length, b.length);
        
    for (; i < len; i++) {
        if ((a[i] && !b[i] && parseInt(a[i]) > 0) || (parseInt(a[i]) > parseInt(b[i]))) {
            return 1;
        } else if ((b[i] && !a[i] && parseInt(b[i]) > 0) || (parseInt(a[i]) < parseInt(b[i]))) {
            return -1;
        }
    }
    
    return 0;
}
