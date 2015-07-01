var WindowManager = require('helper/WindowManager');
var Utils = require('helper/Utils');
var Cloud = require('ti.cloud');
exports['Query Checkin'] = function (evt) {
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
    table.addEventListener('click', function (evt) {
        if (evt.row.id) {
            WindowManager.handleOpenWindow({ target: 'Show Checkin', id: evt.row.id });
        }
    });
    win.add(table);

    win.addEventListener('open', function () {
        Cloud.Checkins.query(function (e) {
            if (e.success) {
                if (e.checkins.length == 0) {
                    table.setData([
                        { title: 'No Results!' }
                    ]);
                }
                else {
                    var data = [];
                    for (var i = 0, l = e.checkins.length; i < l; i++) {
                        data.push(Ti.UI.createTableViewRow({
                            title: e.checkins[i].place.name,
                            id: e.checkins[i].id
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