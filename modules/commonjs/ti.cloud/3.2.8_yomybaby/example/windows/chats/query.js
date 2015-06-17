var WindowManager = require('helper/WindowManager');
var Utils = require('helper/Utils');
var Cloud = require('ti.cloud');

exports['Query Chat Groups'] = function (evt) {
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
    		WindowManager.handleOpenWindow({ target: 'Show Chat Group', id: evt.row.id });
    	}
    });
    win.add(table);

    win.addEventListener('open', function () {
        Cloud.Chats.queryChatGroups(function (e) {
	        if (e.success) {
	            if (e.chat_groups.length == 0) {
	                table.setData([
	                    { title: 'No Results!' }
	                ]);
	            }
	            else {
	                var data = [];
	                for (var i = 0, l = e.chat_groups.length; i < l; i++) {
	                    var group = e.chat_groups[i];
	                    var users = '';
	                    for (var k = 0; k < group.participate_users.length; k++) {
	                        users += ', ' + group.participate_users[k].first_name + ' ' + group.participate_users[k].last_name;
	                    }
	                    data.push(Ti.UI.createTableViewRow({
	                        title: users.substr(2),
	                        id: group.id
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