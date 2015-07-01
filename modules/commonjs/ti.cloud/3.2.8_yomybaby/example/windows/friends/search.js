var WindowManager = require('helper/WindowManager');
var Utils = require('helper/Utils');
var Cloud = require('ti.cloud');
exports['Search Friends of User'] = function (evt) {
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

    function searchFriends() {
        Cloud.Friends.search({
	        user_id: evt.id
        }, function (e) {
	        if (e.success) {
		        if (e.users.length == 0) {
			        table.setData([
				        { title: 'No friends' }
			        ]);
		        } else {
			        var data = [];
			        for (var i = 0, l = e.users.length; i < l; i++) {
				        var user = e.users[i];
				        var row = Ti.UI.createTableViewRow({
					        title: user.first_name + ' ' + user.last_name
				        });
				        data.push(row);
			        }
			        table.setData(data);
		        }
	        }
	        else {
		        table.setData([
			        { title: (e.error && e.message) || e }
		        ]);
		        Utils.error(e);
	        }
        });
    }

    win.addEventListener('open', searchFriends);
    return win;
};