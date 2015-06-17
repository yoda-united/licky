var WindowManager = require('helper/WindowManager');
var Utils = require('helper/Utils');
var Cloud = require('ti.cloud');
exports['Search Friends'] = function (evt) {
    var win = WindowManager.createWindow({
        backgroundColor: 'white'
    });

	var checked = [];

    var table = Ti.UI.createTableView({
        backgroundColor: '#fff',
        top: 0, bottom: 0,
        data: [
            { title: 'Loading, please wait...' }
        ]
    });

    table.addEventListener('click', function (evt) {
        if (evt.row.id) {
	        WindowManager.handleOpenWindow({ target: 'Search Friends of User', id: evt.row.id });
        }
    });
    win.add(table);

    function queryUsers() {
        Cloud.Users.query(function (e) {
            if (e.success) {
                var data = [];
                for (var i = 0, l = e.users.length; i < l; i++) {
                    var user = e.users[i];
                    var row = Ti.UI.createTableViewRow({
                        title: user.first_name + ' ' + user.last_name,
                        id: user.id
                    });
                    data.push(row);
                }
	            table.setData(data);
            }
            else {
                table.setData([
                    { title: (e.error && e.message) || e }
                ]);
                Utils.error(e);
            }
        })
    }

    win.addEventListener('open', queryUsers);
    return win;
};