var WindowManager = require('helper/WindowManager');
var Utils = require('helper/Utils');
var Cloud = require('ti.cloud');
exports['Show Collection\'s Photos'] = function (evt) {
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

    Cloud.PhotoCollections.showPhotos({
        collection_id: evt.id
    }, function (e) {
        content.remove(status);
        if (e.success) {
            if (!e.photos || !e.photos.length) {
                status.text = 'There are no photos here yet!';
                content.add(status);
            }
            else {
                Utils.enumerateProperties(content, e.photos, 20);
            }
        }
        else {
            Utils.error(e);
        }
    });

    return win;
};