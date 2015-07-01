var WindowManager = require('helper/WindowManager');
var Utils = require('helper/Utils');
var Cloud = require('ti.cloud');
exports['Create Push Schedule'] = function (evt) {
    var win = WindowManager.createWindow({
        backgroundColor: 'white'
    });
    var content = Ti.UI.createScrollView({
        top: 0,
        contentHeight: 'auto',
        layout: 'vertical'
    });
    win.add(content);

    var name = Ti.UI.createTextField({
        hintText: 'name',
        top: 10 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u,
        height: 40 + Utils.u,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_NONE,
        autocorrect: false
    });

    content.add(name);

    var start_time = Ti.UI.createTextField({
        hintText: 'YYYY-MM-DDTHH:MM',
        top: 10 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u,
        height: 40 + Utils.u,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_NONE,
        autocorrect: false
    });

    content.add(start_time);

    var recurrence = Ti.UI.createTextField({
        hintText: '{"interval":"daily","end_time":"YYYY-MM-DDTHH:MM"}',
        top: 10 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u,
        height: 40 + Utils.u,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_NONE,
        autocorrect: false
    });
    content.add(recurrence);

    var push_notification = Ti.UI.createTextField({
        hintText: '{"payload":"hello world","channel":"channel"}',
        top: 10 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u,
        height: 40 + Utils.u,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_NONE,
        autocorrect: false
    });
    content.add(push_notification);

    var button = Ti.UI.createButton({
        title: 'Create',
        top: 10 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u, bottom: 10 + Utils.u,
        height: 40 + Utils.u
    });
    content.add(button);

    var fields = [ name, start_time, recurrence, push_notification ];

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
            name: name.value,
            start_time: start_time.value
        };

        var rawPushNotification = push_notification.value;
        if (rawPushNotification.indexOf('{') >= 0) {
            try {
                data.push_notification = JSON.parse(rawPushNotification);
            }
            catch (err) {
                alert('Failed to parse: ' + err.message);
                return;
            }
        } else {
            data.push_notification = rawPushNotification;
        }

        var rawRecurrence = recurrence.value;
        if (rawRecurrence.indexOf('{') >= 0) {
            try {
                data.recurrence = JSON.parse(rawRecurrence);
            }
            catch (err) {
                alert('Failed to parse: ' + err.message);
                return;
            }
        } else {
            data.recurrence = rawRecurrence;
        }

        Cloud.PushSchedules.create({
            schedule: JSON.stringify(data)
        }, function (e) {
            if (e.success) {
                alert('Created!');
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

    return win;
};