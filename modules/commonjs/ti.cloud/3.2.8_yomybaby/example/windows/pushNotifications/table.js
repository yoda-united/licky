var WindowManager = require('helper/WindowManager');
var Utils = require('helper/Utils');
var Cloud = require('ti.cloud');
var PushManager = require('windows/pushNotifications/pushManager');

WindowManager.include(

    '/windows/pushNotifications/query',
    '/windows/pushNotifications/notify',
    '/windows/pushNotifications/settings',
    '/windows/pushNotifications/subscribe',
    '/windows/pushNotifications/unsubscribe',
    '/windows/pushNotifications/notifyTokens',
    '/windows/pushNotifications/subscribeToken',
    '/windows/pushNotifications/unsubscribeToken',
    '/windows/pushNotifications/updateSubscription',
    '/windows/pushNotifications/showChannels',
    '/windows/pushNotifications/queryChannels',
    '/windows/pushNotifications/setBadge',
    '/windows/pushNotifications/resetBadge'
);
exports['Push Notifications'] = function () {
    var win = WindowManager.createWindow({
        backgroundColor: 'white'
    });

    var rows = [
        'Notify',
        'Notify Tokens',
        'Query Subscriptions',
        'Show Channels',
        'Query Channels',
        'Set Badge',
        'Reset Badge'
    ];
    if (Ti.Platform.name === 'iPhone OS' || Ti.Platform.name === 'android') {
        rows.push('Settings for This Device');
        rows.push('Subscribe');
        rows.push('Unsubscribe');
        rows.push('Subscribe Token');
        rows.push('Unsubscribe Token');
        rows.push('Update Subscription');
    }
    else {
        // Our other platforms do not support push notifications yet.
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

PushManager.checkPushNotifications();
