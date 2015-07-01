var WindowManager = require('helper/WindowManager');
var Utils = require('helper/Utils');
var Cloud = require('ti.cloud');
exports['Query Place'] = function (evt) {
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
            WindowManager.handleOpenWindow({ target: 'Show Place', id: evt.row.id });
        }
    });
    win.add(table);

    win.addEventListener('open', function () {
        Cloud.Places.query(function (e) {
            if (e.success) {
                if (e.places.length == 0) {
                    table.setData([
                        { title: 'No Results!' }
                    ]);
                }
                else {
                    var data = [];
                    for (var i = 0, l = e.places.length; i < l; i++) {
                        data.push(Ti.UI.createTableViewRow({
                            title: e.places[i].name,
                            id: e.places[i].id
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