var WindowManager = require('helper/WindowManager');
var Utils = require('helper/Utils');
var Cloud = require('ti.cloud');
exports['Set Badge'] = function (evt) {
    var win = WindowManager.createWindow({
        backgroundColor: 'white'
    });
    var content = Ti.UI.createScrollView({
        top: 0,
        contentHeight: 'auto',
        layout: 'vertical'
    });
    win.add(content);

    var device_token = Ti.UI.createTextField({
        hintText: 'Device Token',
        top: 10 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u,
        height: 40 + Utils.u,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_NONE,
        autocorrect: false
    });
    content.add(device_token);

    var badge_number = Ti.UI.createTextField({
        hintText: 'Badge Number',
        top: 10 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u,
        height: 40 + Utils.u,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_NONE,
        autocorrect: false
    });
    content.add(badge_number);

    var button = Ti.UI.createButton({
        title: 'Set Badge',
        top: 10 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u, bottom: 10 + Utils.u,
        height: 40 + Utils.u
    });
    content.add(button);

    var fields = [ device_token, badge_number ];

    function submitForm() {
        Cloud.PushNotifications.setBadge({
            device_token: device_token.value,
            badge_number: badge_number.value
        }, function (e) {
            if (e.success) {
                device_token.value = '';
                badge_number.value = '';
                alert('Badge Set!');
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
        device_token.focus();
    });
    return win;
};