var WindowManager = require('helper/WindowManager');
var Utils = require('helper/Utils');
var Cloud = require('ti.cloud');
WindowManager.include(

    '/windows/events/create',
	'/windows/events/show',
	'/windows/events/showOccurrences',
	'/windows/events/search',
	'/windows/events/query',
	'/windows/events/queryOccurrences',
	'/windows/events/searchOccurrences',
	'/windows/events/update',
	'/windows/events/remove'
);
exports['Events'] = function (evt) {
    var win = WindowManager.createWindow({
        backgroundColor: 'white'
    });
    var table = Ti.UI.createTableView({
        backgroundColor: '#fff',
        top: 0,
        data: Utils.createRows([
            'Create Event',
	        'Query Events',
	        'Query Event Occurrences',
	        'Search Events',
	        'Search Event Occurrences'
        ])
    });
    table.addEventListener('click', WindowManager.handleOpenWindow);
    win.add(table);
    return win;
};