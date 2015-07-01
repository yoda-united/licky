var WindowManager = require('helper/WindowManager');
var Utils = require('helper/Utils');
var Cloud = require('ti.cloud');
exports['Query Geo Fences'] = function (evt) {
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
            WindowManager.handleOpenWindow({ target: 'Update GeoFence', id: evt.row.id });
        }
    });

    win.addEventListener('focus', function () {
        table.setData([{ title: 'Loading, please wait...' }]);
        Cloud.GeoFences.query({}, function (e) {
            if (e.success) {
                if (e.geo_fences.length == 0) {
                    table.setData([
                        { title: 'No Results!' }
                    ]);
                } else {
                    var data = [];
                    for (var i = 0, l = e.geo_fences.length; i < l; i++) {
                        data.push(Ti.UI.createTableViewRow({
                            title: e.geo_fences[i].payload,
                            loc: e.geo_fences[i].loc,
                            id: e.geo_fences[i].id
                        }));
                    }
                    table.setData(data);
                }
            } else {
                Utils.error(e);
            }
        });
    });
    return win;
};