var WindowManager = require('helper/WindowManager');
var Utils = require('helper/Utils');
var Cloud = require('ti.cloud');
WindowManager.include(

    '/windows/friends/add',
	'/windows/friends/approve',
	'/windows/friends/searchUsers',
	'/windows/friends/search',
	'/windows/friends/remove'
);
exports['Friends'] = function (evt) {
    var win = WindowManager.createWindow({
        backgroundColor: 'white'
    });
    var table = Ti.UI.createTableView({
        backgroundColor: '#fff',
        top: 0,
        data: Utils.createRows([
            'Add Friends',
	        'Approve Friends',
	        'Search Friends',
	        'Remove Friends'
        ])
    });
    table.addEventListener('click', WindowManager.handleOpenWindow);
    win.add(table);
    return win;
};