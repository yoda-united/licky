var WindowManager = require('helper/WindowManager');
var Utils = require('helper/Utils');
var Cloud = require('ti.cloud');
exports['Show Channels'] = function (evt) {
    var win = WindowManager.createWindow({
        backgroundColor: 'white'
    });

    var name = Ti.UI.createTextField({
        hintText: 'channel name',
        top: 10 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u,
        height: 40 + Utils.u,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_NONE,
        autocorrect: false
    });
    win.add(name);
    
    var button = Ti.UI.createButton({
        title: 'Show Channels',
        top: 10 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u, bottom: 10 + Utils.u,
        height: 40 + Utils.u
    });
    win.add(button);
    
    var table = Ti.UI.createTableView({
        backgroundColor: '#fff',
        top: 0, bottom: 0,
        data: []
    });
    win.add(table);

    button.addEventListener('click', submitQuery);
    name.addEventListener('return', submitQuery);
    
    function submitQuery() {
        Cloud.PushNotifications.showChannels({
            name: name.value
        },function (e) {
            if (e.success) {
                var data = [];
                var row = Ti.UI.createTableViewRow({
                    layout: 'vertical'
                });
                Utils.enumerateProperties(row, e.devices, 20);
                data.push(row);
                table.setData(data);
            }
            else {
                Utils.error(e);
            }
        });
    }    

    return win;
};