var WindowManager = require('helper/WindowManager');
var Utils = require('helper/Utils');
var Cloud = require('ti.cloud');
WindowManager.include(

    '/windows/messages/create',
	'/windows/messages/selectUsers',
	'/windows/messages/showInbox',
	'/windows/messages/showSent',
	'/windows/messages/showThreads',
	'/windows/messages/showThreadMessages',
	'/windows/messages/show',
	'/windows/messages/remove',
	'/windows/messages/removeThread',
	'/windows/messages/reply'
);
exports['Messages'] = function (evt) {
    var win = WindowManager.createWindow({
        backgroundColor: 'white'
    });
    var table = Ti.UI.createTableView({
        backgroundColor: '#fff',
        top: 0,
        data: Utils.createRows([
            'Create Message',
	        'Show Inbox',
	        'Show Sent',
	        'Show Threads'
        ])
    });
    table.addEventListener('click', WindowManager.handleOpenWindow);
    win.add(table);
    return win;
};