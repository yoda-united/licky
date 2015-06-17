var WindowManager = require('helper/WindowManager');
var Utils = require('helper/Utils');
var Cloud = require('ti.cloud');
exports['Query Channels'] = function (evt) {
    var win = WindowManager.createWindow({
        backgroundColor: 'white'
    });
    var content = Ti.UI.createScrollView({
        top: 0,
        contentHeight: 'auto',
        layout: 'vertical'
    });
    win.add(content);

    win.addEventListener('open', submitQuery);
    
    function submitQuery() {
        Cloud.PushNotifications.queryChannels(function (e) {
            if (e.success) {
                if (e.push_channels.length == 0) {
                    content.add(Ti.UI.createLabel({
                        text: 'No Results!', textAlign: 'left',
                        height: 30 + Utils.u, left: 20 + Utils.u, right: 20 + Utils.u
                    }));
                } else {
                    content.add(Ti.UI.createLabel({
                        text: 'Channels:', textAlign: 'left',
                        height: 30 + Utils.u, left: 20 + Utils.u, right: 20 + Utils.u
                    }));
                    Utils.enumerateProperties(content, e.push_channels, 20);
                }
            }
            else {
                Utils.error(e);
            }
        });
    }    

    return win;
};