var WindowManager = require('helper/WindowManager');
var Utils = require('helper/Utils');
var Cloud = require('ti.cloud');
WindowManager.include(
    '/windows/checkins/create',
    '/windows/checkins/query',
    '/windows/checkins/remove',
    '/windows/checkins/show'
);

var WindowManager = require('helper/WindowManager');
var Utils = require('helper/Utils');
var Cloud = require('ti.cloud');
exports['Checkins'] = function (evt) {
    var win = WindowManager.createWindow({
        backgroundColor: 'white'
    });
    var table = Ti.UI.createTableView({
        backgroundColor: '#fff',
        top: 0,
        data: Utils.createRows([
            'Create Checkin',
            'Query Checkin'
        ])
    });
    table.addEventListener('click', WindowManager.handleOpenWindow);
    win.add(table);
    return win;
};