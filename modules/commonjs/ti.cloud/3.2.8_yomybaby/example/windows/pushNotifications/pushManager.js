var androidPushModule = null;
var onPushEnabled = null;
var onPushDisabled = null;

function receivePush(e) {
    alert('Received push: ' + JSON.stringify(e));
}

function trayClickFocusedApp(e) {
    Ti.API.info('TrayClickFocusedApp: ' + e.payload);
}

function trayClickLaunchedApp(e) {
    Ti.API.info('TrayClickLaunchedApp: ' + e.payload);
}

function enablePushNotifications() {
    Utils.pushNotificationsEnabled = true;
    Ti.App.Properties.setBool('PushNotifications-Enabled', true);
    checkPushNotifications();
    onPushEnabled && onPushEnabled();
}

function disablePushNotifications() {
    Utils.pushNotificationsEnabled = false;
    Ti.App.Properties.setBool('PushNotifications-Enabled', false);
    checkPushNotifications();
    onPushDisabled && onPushDisabled();
}

function setOnPushEnabled(cb) {
    onPushEnabled = cb;
}

function setOnPushDisabled(cb) {
    onPushDisabled = cb;
}

function getAndroidPushModule() {
    try {
        return require('ti.cloudpush')
    }
    catch (err) {
        alert('Unable to require the ti.cloudpush module for Android!');
        Utils.pushNotificationsEnabled = false;
        Ti.App.Properties.setBool('PushNotifications-Enabled', false);
        onPushDisabled && onPushDisabled();
        return null;
    }
}

function checkPushNotifications() {
    if (Utils.pushNotificationsEnabled === null) {
        Utils.pushNotificationsEnabled = Ti.App.Properties.getBool('PushNotifications-Enabled', false);
    }
    if (Ti.Platform.name === 'iPhone OS') {
        if (Utils.pushNotificationsEnabled) {
            if (Titanium.Platform.model == 'Simulator') {
                alert('The simulator does not support push!');
                disablePushNotifications();
                return;
            }

            var registerForPushProperties = {
                success: deviceTokenSuccess,
                error: deviceTokenError,
                callback: receivePush
            };
            if (Utils.IOS8) {
                // On iOS 8 + user notification types need to be registered via registerUserNotificationSettings.
                function userNotificationSettingsChanged(e) {
                    Ti.App.iOS.removeEventListener('usernotificationsettings',userNotificationSettingsChanged);
                    // You can check the permissions allowed via the object passed to this event callback.
                    // You will likely want to check what permissions have been allowed at this point, but
                    // we are just going to registerForPushNotifications in this example.
                    Ti.Network.registerForPushNotifications(registerForPushProperties);
                }
                // Add 'usernotificationsettings' event listener to ensure that registerForPushNotifications is 
                // called after userNotificationSettings has changed.
                // When this event is fired, it means that the user clicked a button on the alert asking for 
                // permission to send notifications (they may have allowed or denied the notification).
                Ti.App.iOS.addEventListener('usernotificationsettings', userNotificationSettingsChanged);

                Ti.App.iOS.registerUserNotificationSettings({
                    types: [Ti.App.iOS.USER_NOTIFICATION_TYPE_ALERT,
                            Ti.App.iOS.USER_NOTIFICATION_TYPE_SOUND,
                            Ti.App.iOS.USER_NOTIFICATION_TYPE_BADGE]
                });
            } else {
                // Before iOS 8 notification types need to be passed to registerForPushNotifications
                registerForPushProperties.types = [
                    Ti.Network.NOTIFICATION_TYPE_BADGE,
                    Ti.Network.NOTIFICATION_TYPE_ALERT,
                    Ti.Network.NOTIFICATION_TYPE_SOUND
                ];
                Ti.Network.registerForPushNotifications(registerForPushProperties);
            }
        }
        else {
            Ti.Network.unregisterForPushNotifications();
            Utils.pushDeviceToken = null;
        }
    }
    else if (Ti.Platform.name === 'android') {
        if (androidPushModule === null) {
            androidPushModule = getAndroidPushModule();
            if (androidPushModule === null) {
                return;
            }
        }
        // If Google Play Services is not available then we should not continue
        var code = androidPushModule.isGooglePlayServicesAvailable();
        if (code != androidPushModule.SUCCESS) {
            alert ("Google Play Services is not installed/updated/available");
        }
        if (Utils.pushNotificationsEnabled && code == androidPushModule.SUCCESS) {
            // Need to retrieve the device token before enabling push
            androidPushModule.retrieveDeviceToken({
                success: deviceTokenSuccess,
                error: deviceTokenError
            });
        }
        else {
            androidPushModule.enabled = false;
            androidPushModule.removeEventListener('callback', receivePush);
            androidPushModule.removeEventListener('trayClickFocusedApp', trayClickFocusedApp);
            androidPushModule.removeEventListener('trayClickLaunchedApp', trayClickLaunchedApp);
            Utils.pushDeviceToken = null;
        }
    }
}

function deviceTokenSuccess(e) {
    Utils.pushDeviceToken = e.deviceToken;
    Utils.pushToken = Utils.pushDeviceToken; 
    alert('Device token is retrieved: ' + Utils.pushDeviceToken);
    Ti.API.info('Device Token: ' + Utils.pushDeviceToken);
    if (androidPushModule) {
        androidPushModule.enabled = true;
        androidPushModule.addEventListener('callback', receivePush);
        androidPushModule.addEventListener('trayClickFocusedApp', trayClickFocusedApp);
        androidPushModule.addEventListener('trayClickLaunchedApp', trayClickLaunchedApp);
    }
}

function deviceTokenError(e) {
    alert('Failed to register for push! ' + e.error);
    disablePushNotifications();
}

exports.disablePushNotifications = disablePushNotifications;
exports.enablePushNotifications = enablePushNotifications;
exports.setOnPushEnabled = setOnPushEnabled;
exports.setOnPushDisabled = setOnPushDisabled;
exports.checkPushNotifications = checkPushNotifications;
exports.getAndroidPushModule = getAndroidPushModule;
