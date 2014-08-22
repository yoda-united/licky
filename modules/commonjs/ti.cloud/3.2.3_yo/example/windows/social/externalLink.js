windowFunctions['External Link'] = function (evt) {
    var win = createWindow();
    var offset = addBackButton(win);
    var content = Ti.UI.createScrollView({
        top: offset + u,
        contentHeight: 'auto',
        layout: 'vertical'
    });
    win.add(content);

    // TODO: Get your own App ID from Facebook: https://developers.facebook.com/docs/opengraph/tutorial/#create-app
    Facebook.appid = '<<YOUR FACEBOOK APPID HERE>>';
    Facebook.permissions = ['publish_stream', 'read_stream'];

    var label = Ti.UI.createLabel({
        textAlign: 'center',
        top: 10 + u, right: 10 + u, left: 10 + u,
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
                    error(e);
                }
            });
        }
        else {
            label.text = 'Please login to Facebook.';
        }
    }

    content.add(Facebook.createLoginButton({
        top: 10 + u,
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

    win.open();
};