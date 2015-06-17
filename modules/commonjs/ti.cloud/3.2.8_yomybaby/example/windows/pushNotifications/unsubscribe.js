var WindowManager = require('helper/WindowManager');
var Utils = require('helper/Utils');
var Cloud = require('ti.cloud');
exports['Unsubscribe'] = function (evt) {
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

    var channel = Ti.UI.createTextField({
        hintText: 'Channel (leave blank for all)',
        top: 10 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u,
        height: 40 + Utils.u,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_NONE,
        autocorrect: false
    });
    content.add(channel);

    var button = Ti.UI.createButton({
        title: 'Unsubscribe',
        top: 10 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u, bottom: 10 + Utils.u,
        height: 40 + Utils.u
    });
    content.add(button);

    var fields = [ channel ];

    function submitForm() {
        for (var i = 0; i < fields.length; i++) {
            fields[i].blur();
        }
        button.hide();

        var data = {
            device_token: Utils.pushDeviceToken
        };

        if (channel.value && channel.value.length) {
            data.channel = channel.value;
        }
        Cloud.PushNotifications.unsubscribe(data, function (e) {
            if (e.success) {
                channel.value = '';
                alert('Unsubscribed!');
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
        channel.focus();
    });
    return win;
};