var WindowManager = require('helper/WindowManager');
var Utils = require('helper/Utils');
var Cloud = require('ti.cloud');
exports['Query Status'] = function (evt) {
    var win = WindowManager.createWindow({
        backgroundColor: 'white'
    });

    var table = Ti.UI.createTableView({
        backgroundColor: '#fff',
        top: 0, bottom: 0,
        data: [
            { title: 'Loading, please wait...' }
        ]
    });
    win.add(table);
    
    table.addEventListener('click', function (evt) {
        if (evt.row.id) {
            WindowManager.handleOpenWindow({ target: 'Update Status', id: evt.row.id });
        }
    });

    win.addEventListener('focus', function () {
        table.setData([{ title: 'Loading, please wait...' }]);
        Cloud.Statuses.query(function (e) {
            if (e.success) {
                if (e.statuses.length == 0) {
                    table.setData([
                        { title: 'No Results!' }
                    ]);
                }
                else {
                    var data = [];
                    for (var i = 0, l = e.statuses.length; i < l; i++) {
                        data.push(Ti.UI.createTableViewRow({
                            title: e.statuses[i].message,
                            id: e.statuses[i].id
                        }));
                    }
                    table.setData(data);
                }
            }
            else {
                Utils.error(e);
            }
        });
    });
    return win;
};