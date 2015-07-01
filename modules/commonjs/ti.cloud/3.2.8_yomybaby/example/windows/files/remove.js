var WindowManager = require('helper/WindowManager');
var Utils = require('helper/Utils');
var Cloud = require('ti.cloud');
exports['Remove File'] = function (evt) {
    var win = WindowManager.createWindow({
        backgroundColor: 'white'
    });

    var button = Ti.UI.createButton({
        title: 'Are you sure?',
        top: 10 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u, bottom: 10 + Utils.u,
        height: 40 + Utils.u
    });
    win.add(button);

    var status = Ti.UI.createLabel({
        text: '', textAlign: 'center',
        left: 20 + Utils.u, right: 20 + Utils.u
    });
    win.add(status);

    button.addEventListener('click', function () {
        button.hide();
        status.text = 'Removing, please wait...';
        Cloud.Files.remove({
            file_id: evt.id
        }, function (e) {
            if (e.success) {
                status.text = 'Removed!';
            } else {
                status.text = '' + (e.error && e.message) || e;
            }
        });
    });

    return win;
};