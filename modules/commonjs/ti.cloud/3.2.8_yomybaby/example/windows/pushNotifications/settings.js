var WindowManager = require('helper/WindowManager');
var Utils = require('helper/Utils');
var Cloud = require('ti.cloud');
var PushManager = require('windows/pushNotifications/pushManager');
var androidPushModule = null;
exports['Settings for This Device'] = function (evt) {
    var win = WindowManager.createWindow({
        backgroundColor: 'white'
    });
    var content = Ti.UI.createScrollView({
        top: 0,
        contentHeight: 'auto',
        layout: 'vertical'
    });
    win.add(content);

    var enablePush = Ti.UI.createButton({
        top: 10, width: 320, height: 50,
        title: Utils.pushNotificationsEnabled ? 'Enabled' : 'Disabled'
    });
    enablePush.addEventListener('click', function () {
        if (!Utils.pushNotificationsEnabled) {
            PushManager.enablePushNotifications();
        } else {
            PushManager.disablePushNotifications();
        }
    });
    function setEnableButtonTitle() {
        enablePush.title = Utils.pushNotificationsEnabled ? 'Enabled' : 'Disabled';
    }
    PushManager.setOnPushEnabled(setEnableButtonTitle);
    PushManager.setOnPushDisabled(setEnableButtonTitle);
    content.add(enablePush);

    if (Ti.Platform.name === 'iPhone OS') {
        /*
         iOS doesn't let us make customizations here.
         The user can do this from the settings for the application.
         */
    }
    else if (Ti.Platform.name === 'android') {
        if (androidPushModule === null) {
            androidPushModule = PushManager.getAndroidPushModule();
            if (androidPushModule === null) {
                return win;
            }
        }
        /*
         Whether or not to show a tray notification.
         */
        var showTrayNotification = Ti.UI.createButton({
            top: 10, width: 320, height: 50,
            title: androidPushModule.showTrayNotification ? 'Show in Tray' : 'Do Not Show in Tray'
        });
        showTrayNotification.addEventListener('click', function () {
            androidPushModule.showTrayNotification = !androidPushModule.showTrayNotification;
            showTrayNotification.title = androidPushModule.showTrayNotification ? 'Show in Tray' : 'Do Not Show in Tray';
        });
        content.add(showTrayNotification);

        /*
         Whether or not clicking a tray notification focuses the app.
         */
        var showAppOnTrayClick = Ti.UI.createButton({
            top: 10, width: 320, height: 50,
            title: androidPushModule.showAppOnTrayClick ? 'Tray Click Shows App' : 'Tray Click Does Nothing'
        });
        showAppOnTrayClick.addEventListener('click', function () {
            androidPushModule.showAppOnTrayClick = !androidPushModule.showAppOnTrayClick;
            showAppOnTrayClick.title = androidPushModule.showAppOnTrayClick ? 'Tray Click Shows App' : 'Tray Click Does Nothing';
        });
        content.add(showAppOnTrayClick);

        /*
         Whether or not tray notifications are shown when the app is in the foreground.
         */
        var showTrayNotificationsWhenFocused = Ti.UI.createButton({
            top: 10, width: 320, height: 50,
            title: androidPushModule.showTrayNotificationsWhenFocused ? 'Show Trays when Focused' : 'Hide Trays when Focused'
        });
        showTrayNotificationsWhenFocused.addEventListener('click', function () {
            androidPushModule.showTrayNotificationsWhenFocused = !androidPushModule.showTrayNotificationsWhenFocused;
            showTrayNotificationsWhenFocused.title = androidPushModule.showTrayNotificationsWhenFocused ? 'Show Trays when Focused' : 'Hide Trays when Focused';
        });
        content.add(showTrayNotificationsWhenFocused);

        /*
         Whether or not receiving a push immediately brings the application to the foreground.
         */
        var focusAppOnPush = Ti.UI.createButton({
            top: 10, width: 320, height: 50,
            title: androidPushModule.focusAppOnPush ? 'Push Focuses App' : 'Push Doesn\'t Focus App'
        });
        focusAppOnPush.addEventListener('click', function () {
            androidPushModule.focusAppOnPush = !androidPushModule.focusAppOnPush;
            focusAppOnPush.title = androidPushModule.focusAppOnPush ? 'Push Focuses App' : 'Push Doesn\'t Focus App';
        });
        content.add(focusAppOnPush);

        /*
         Trigger callbacks together or one by one when multiple push notifications come.
         */
        var singleCallback = Ti.UI.createButton({
            top: 10, width: 320, height: 50,
            title: androidPushModule.singleCallback ? 'Callbacks trigger one by one' : 'Callbacks trigger together'
        });
        singleCallback.addEventListener('click', function () {
            androidPushModule.singleCallback = !androidPushModule.singleCallback;
            singleCallback.title = androidPushModule.singleCallback ? 'Callbacks trigger one by one' : 'Callbacks trigger together';
        });
        content.add(singleCallback);
    }
    
    /*
     If push is enabled, copy the token to clipboard.
    */
    var copyPushToken = Ti.UI.createButton({
        top: 10, width: 320, height: 50,
        title: 'Copy Push Token to Clipboard'
    });
    copyPushToken.addEventListener('click', function () {
       if ( Utils.pushNotificationsEnabled ) {
           alert('Token ' + Utils.pushToken + ' copied to clipboard.');
           Ti.UI.Clipboard.setText(Utils.pushToken);
       } else {
           alert('Please enable the push notification.');
       }
    });
    content.add(copyPushToken);

    return win;
};