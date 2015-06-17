var WindowManager = require('helper/WindowManager');
var Utils = require('helper/Utils');
var Cloud = require('ti.cloud');
exports['Query Subscriptions'] = function (evt) {
    var win = WindowManager.createWindow({
        backgroundColor: 'white'
    });

    var userId = Ti.UI.createTextField({
        hintText: 'user_id',
        top: 10 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u,
        height: 40 + Utils.u,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_NONE,
        autocorrect: false
    });
    win.add(userId);
    
    var button = Ti.UI.createButton({
        title: 'Query Subscriptions',
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
    userId.addEventListener('return', submitQuery);
    
    function submitQuery() {
        Cloud.PushNotifications.query({
            user_id: userId.value
        },function (e) {
            if (e.success) {
                if (e.subscriptions.length == 0) {
                    table.setData([
                        { title: 'No Results!' }
                    ]);
                }
                else {
                    var data = [];
                    var row;
                    for (var i = 0, l = e.subscriptions.length; i < l; i++) {
                        row = Ti.UI.createTableViewRow({
                            layout: 'vertical'
                        });
                        Utils.enumerateProperties(row, e.subscriptions[i], 20);
                        data.push(row);
                    }
                    table.setData(data);
                }
            }
            else {
                Utils.error(e);
            }
        });
    }    

    return win;
};
