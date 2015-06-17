var WindowManager = require('helper/WindowManager');
var Utils = require('helper/Utils');
var Cloud = require('ti.cloud');
exports['External Link'] = function (evt) {
    var Facebook = Ti.Facebook ? Ti.Facebook : require('facebook');
    var win = WindowManager.createWindow({
        backgroundColor: 'white'
    });
    var content = Ti.UI.createScrollView({
        top: 0,
        contentHeight: 'auto',
        layout: 'vertical'
    });
    win.add(content);

    // TODO: Get your own App ID from Facebook: https://developers.facebook.com/docs/opengraph/tutorial/#create-app
    Facebook.appid = '<<YOUR FACEBOOK APPID HERE>>';
    Facebook.permissions = ['publish_stream', 'read_stream'];

    var label = Ti.UI.createLabel({
        textAlign: 'center',
        top: 10 + Utils.u, right: 10 + Utils.u, left: 10 + Utils.u,
        height: 'auto'
    });
    content.add(label);

    function updateLoginStatus() {
        if (Facebook.loggedIn) {
            label.text = 'Linking with logged in user, please wait...';
            Cloud.SocialIntegrations.externalAccountLink({
                type: 'facebook',
                token: Facebook.accessToken
            }, function (e) {
                if (e.success) {
                    alert('Linked!');
                }
                else {
                    Utils.error(e);
                }
            });
        }
        else {
            label.text = 'Please login to Facebook.';
        }
    }

    content.add(Facebook.createLoginButton({
        top: 10 + Utils.u,
        style: Ti.Platform.name == 'iPhone OS'
            ? Facebook.BUTTON_STYLE_WIDE
            : 'wide'
    }));

    win.addEventListener('open', function (evt) {
   		Facebook.addEventListener('login', updateLoginStatus);
    	Facebook.addEventListener('logout', updateLoginStatus);    
        updateLoginStatus();
    });
    win.addEventListener('close', function (evt) {
   		Facebook.removeEventListener('login', updateLoginStatus);
    	Facebook.removeEventListener('logout', updateLoginStatus);       	
    });

    return win;
};