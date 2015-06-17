var WindowManager = require('helper/WindowManager');
var Utils = require('helper/Utils');
var Cloud = require('ti.cloud');
exports['Show Checkin'] = function (evt) {
    var win = WindowManager.createWindow({
        backgroundColor: 'white'
    });
    var content = Ti.UI.createScrollView({
        top: 0,
        contentHeight: 'auto',
        layout: 'vertical'
    });
    win.add(content);

    var status = Ti.UI.createLabel({
        text: 'Loading, please wait...', textAlign: 'left',
        height: 30 + Utils.u, left: 20 + Utils.u, right: 20 + Utils.u
    });
    content.add(status);

    Cloud.Checkins.show({
        checkin_id: evt.id
    }, function (e) {
        content.remove(status);

        var remove = Ti.UI.createButton({
            title: 'Remove Checkin',
            top: 10 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u, bottom: 10 + Utils.u,
            height: 40 + Utils.u
        });
        remove.addEventListener('click', function () {
            WindowManager.handleOpenWindow({ target: 'Remove Checkin', id: evt.id });
        });
        content.add(remove);

        if (e.success) {
            Utils.enumerateProperties(content, e.checkins[0], 20);
        }
        else {
            Utils.error(e);
        }
    });

    return win;
};