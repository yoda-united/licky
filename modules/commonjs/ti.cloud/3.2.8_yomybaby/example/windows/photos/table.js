var WindowManager = require('helper/WindowManager');
var Utils = require('helper/Utils');
var Cloud = require('ti.cloud');
WindowManager.include(

    '/windows/photos/create',
    '/windows/photos/query',
    '/windows/photos/remove',
    '/windows/photos/search',
    '/windows/photos/show',
    '/windows/photos/update'
);
exports['Photos'] = function (evt) {
    var win = WindowManager.createWindow({
        backgroundColor: 'white'
    });
    var rows = [
        'Query Photo',
        'Search Photo'
    ];
    if (Ti.Media.openPhotoGallery || Ti.Media.showCamera) {
        rows.unshift('Create Photo');
    }
    var table = Ti.UI.createTableView({
        backgroundColor: '#fff',
        top: 0,
        data: Utils.createRows(rows)
    });
    table.addEventListener('click', WindowManager.handleOpenWindow);
    win.add(table);
    return win;
};