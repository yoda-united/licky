var WindowManager = require('helper/WindowManager');
var Utils = require('helper/Utils');
var Cloud = require('ti.cloud');

WindowManager.include(
    '/windows/social/externalLink',
    '/windows/social/externalLogin',
    '/windows/social/externalUnlink',
    '/windows/social/searchFacebookFriends'
);

exports['Social'] = function (evt) {
    // Be sure to include the "facebook" module when running this app. It is now separate from the sdk.
    var Facebook = Ti.Facebook ? Ti.Facebook : require('facebook');
    var win = WindowManager.createWindow({
        backgroundColor: 'white'
    });
    var rows = [
        'Search Facebook Friends'
    ];
    if (Facebook.createLoginButton) {
        var available = true;
        try {
            Facebook.createLoginButton();
        }
        catch (err) {
            available = false;
        }
        if (available) {
            rows.push('External Link');
            rows.push('External Login');
            rows.push('External Unlink');
        }
    }
    var table = Ti.UI.createTableView({
        backgroundColor: '#fff',
        top: 0,
        data: Utils.createRows(rows)
    });
    table.addEventListener('click', WindowManager.handleOpenWindow);
    win.add(table);
    return win;
};