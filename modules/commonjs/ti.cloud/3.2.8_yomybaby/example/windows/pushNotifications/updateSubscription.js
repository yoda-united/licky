var WindowManager = require('helper/WindowManager');
var Utils = require('helper/Utils');
var Cloud = require('ti.cloud');
exports['Update Subscription'] = function (evt) {
    var win = WindowManager.createWindow({
        backgroundColor: 'white'
    });
    var content = Ti.UI.createScrollView({
        top: 0,
        contentHeight: 'auto',
        layout: 'vertical'
    });
    win.add(content);

    if (!Utils.pushDeviceToken) {
        content.add(Ti.UI.createLabel({
            text: 'Please visit Push Notifications > Settings to enable push!',
            textAlign: 'center',
            color: '#000',
            height: 'auto'
        }));
        return win;
        return;
    }

    // These variables represent the device's geographic coordinates,
    // and are passed in the 'loc' parameter to the updateSubscription() method.
    // This enables a Dashboard administrator to send a push notification to this user based on their location.

    var currentLatitude = "37.3895100";
    var currentLongitude = "-122.0502150";

    var latitude = Ti.UI.createTextField({
        hintText: 'Latitude',
        top: 10 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u,
        height: 40 + Utils.u,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_NONE,
        autocorrect: false,
        value: currentLatitude
    });
    content.add(latitude);
    
    var longitude = Ti.UI.createTextField({
        hintText: 'Longitude',
        top: 10 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u,
        height: 40 + Utils.u,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_NONE,
        autocorrect: false,
        value: currentLongitude
    });
    content.add(longitude);

    var button = Ti.UI.createButton({
        title: 'Update',
        top: 10 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u, bottom: 10 + Utils.u,
        height: 40 + Utils.u
    });
    content.add(button);    

    var fields = [ longitude, latitude ];

    function submitForm() {
        for (var i = 0; i < fields.length; i++) {
            if (!fields[i].value.length) {
                fields[i].focus();
                return;
            }
            fields[i].blur();
        }
        button.hide();

        Cloud.PushNotifications.updateSubscription({
            device_token: Utils.pushDeviceToken,
            loc: [parseFloat(longitude.value), parseFloat(latitude.value)]
        }, function (e) {
            if (e.success) {
                alert('Subscription Updated! ' + Utils.pushDeviceToken);
            }
            else {
                Utils.error(e);
            }
            button.show();
        });
    }

    button.addEventListener('click', submitForm);
    for (var i = 0; i < fields.length; i++) {
        fields[i].addEventListener('return', submitForm);
    }

    win.addEventListener('open', function () {
        latitude.focus();
    });
    return win;
};