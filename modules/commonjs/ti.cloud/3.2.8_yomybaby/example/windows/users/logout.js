var WindowManager = require('helper/WindowManager');
var Utils = require('helper/Utils');
var Cloud = require('ti.cloud');
exports['Logout Current User'] = function (evt) {
    var win = WindowManager.createWindow({
        backgroundColor: 'white'
    });
    var status = Ti.UI.createLabel({
        text: 'Logging out, please wait...',
        textAlign: 'center'
    });
    win.add(status);
    return win;
    Cloud.Users.logout(function (e) {
        if (e.success) {
            status.text = 'Logged out!';
        }
        else {
            status.text = (e.error && e.message) || e;
        }
    });
};