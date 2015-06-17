var WindowManager = require('helper/WindowManager');
var Utils = require('helper/Utils');
var Cloud = require('ti.cloud');
exports['Notify'] = function (evt) {
    var win = WindowManager.createWindow({
        backgroundColor: 'white'
    });
    var content = Ti.UI.createScrollView({
        top: 0,
        contentHeight: 'auto',
        layout: 'vertical'
    });
    win.add(content);

    var channel = Ti.UI.createTextField({
        hintText: 'Channel',
        top: 10 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u,
        height: 40 + Utils.u,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_NONE,
        autocorrect: false
    });
    content.add(channel);

    var payload = Ti.UI.createTextField({
        hintText: 'Payload (String or JSON)',
        top: 10 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u,
        height: 40 + Utils.u,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_NONE,
        autocorrect: false
    });
    content.add(payload);

    var toFriends = false;
    var toggleToFriends = Ti.UI.createButton({
        top: 10 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u, bottom: 10 + Utils.u,
        height: 40 + Utils.u
    });
    toggleToFriends.addEventListener('click', function () {
        toFriends = !toFriends;
        syncToFriends();
    });
    content.add(toggleToFriends);
    function syncToFriends() {
        toggleToFriends.title = toFriends ? 'Push Goes to Friends' : 'Push Goes to User';
    }

    syncToFriends();

    var button = Ti.UI.createButton({
        title: 'Notify',
        top: 10 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u, bottom: 10 + Utils.u,
        height: 40 + Utils.u
    });
    content.add(button);

    var fields = [ channel, payload ];

    function submitForm() {
        for (var i = 0; i < fields.length; i++) {
            if (!fields[i].value.length) {
                fields[i].focus();
                return;
            }
            fields[i].blur();
        }
        button.hide();

        var data = {
            channel: channel.value
        };

        var rawPayload = payload.value;
        if (rawPayload.indexOf('{') >= 0) {
            try {
                data.payload = JSON.parse(rawPayload);
            }
            catch (err) {
                alert('Failed to parse: ' + err.message);
                return;
            }
        }
        else {
            data.payload = rawPayload;
        }

        if (toFriends) {
            data.friends = true;
        }

        Cloud.PushNotifications.notify(data, function (e) {
            if (e.success) {
                alert('Notified!');
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