var WindowManager = require('helper/WindowManager');
var Utils = require('helper/Utils');
var Cloud = require('ti.cloud');
WindowManager.include(

    '/windows/photoCollections/create',
    '/windows/photoCollections/update',
    '/windows/photoCollections/search',
    '/windows/photoCollections/remove',
    '/windows/photoCollections/show',
    '/windows/photoCollections/showSubcollections',
    '/windows/photoCollections/showPhotos'
);
exports['Photo Collections'] = function (evt) {
    var win = WindowManager.createWindow({
        backgroundColor: 'white'
    });
    var table = Ti.UI.createTableView({
        backgroundColor: '#fff',
        top: 0,
        data: Utils.createRows([
            'Create Photo Collection',
            'Search Photo Collections'
        ])
    });
    table.addEventListener('click', WindowManager.handleOpenWindow);
    win.add(table);
    return win;
};