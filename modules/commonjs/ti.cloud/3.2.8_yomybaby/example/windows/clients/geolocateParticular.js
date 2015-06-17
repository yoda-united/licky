var WindowManager = require('helper/WindowManager');
var Utils = require('helper/Utils');
var Cloud = require('ti.cloud');
exports['Geolocate Particular'] = function (evt) {
    var win = WindowManager.createWindow({
        backgroundColor: 'white'
    });

    var ipAddress = Ti.UI.createTextField({
        hintText: 'IP Address',
        top: 10 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u,
        height: 40 + Utils.u,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_NONE,
        keyboardType: Ti.UI.KEYBOARD_DECIMAL_PAD
    });
    win.add(ipAddress);

    var button = Ti.UI.createButton({
        title: 'Search',
        top: 60 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u,
        height: 40 + Utils.u
    });
    win.add(button);

    var content = Ti.UI.createScrollView({
        top: 110 + Utils.u,
        contentHeight: 'auto',
        layout: 'vertical'
    });
    win.add(content);

    var status = Ti.UI.createLabel({
        text: 'Loading, please wait...', textAlign: 'left',
        height: 30 + Utils.u, left: 20 + Utils.u, right: 20 + Utils.u
    });

    function lookup() {
        win.remove(content);
        content = Ti.UI.createScrollView({
            top: 110 + Utils.u,
            contentHeight: 'auto',
            layout: 'vertical'
        });
        win.add(content);
        content.add(status);
        Cloud.Clients.geolocate({
            ip_address: ipAddress.value
        }, function (e) {
            content.remove(status);
            ipAddress.blur();
            if (e.success) {
                ipAddress.value = '';
                Utils.enumerateProperties(content, e, 20);
            }
            else {
                Utils.error(e);
            }
        });
    }

    ipAddress.addEventListener('return', lookup);
    button.addEventListener('click', lookup);
    win.addEventListener('open', function (evt) {
        ipAddress.focus();
    });

    return win;
};