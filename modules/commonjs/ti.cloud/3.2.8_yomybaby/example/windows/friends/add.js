var WindowManager = require('helper/WindowManager');
var Utils = require('helper/Utils');
var Cloud = require('ti.cloud');
exports['Add Friends'] = function (evt) {
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
            evt.row.hasCheck = !evt.row.hasCheck;
	        if (evt.row.hasCheck) {
		        checked.push(evt.row.id);
	        } else {
		        checked.splice(checked.indexOf(evt.row.id),1);
	        }
        } else if (checked.length == 0) {
            alert('No users selected');
        } else {
			Cloud.Friends.add({
				user_ids: checked.join(",")
			}, function(e) {
		        if (e.success) {
			        alert('Friend(s) added');
		        } else {
			        Utils.error(e);
		        }
	        });
        }
    });
    win.add(table);

	function getMyID(callback) {
		Cloud.Users.showMe(function (e) {
			if (e.success) {
                callback(e.users[0].id);
            }
            else {
                table.setData([
                    { title: (e.error && e.message) || e }
                ]);
                Utils.error(e);
            }
        });
    }

    function queryUsers(myID) {
        Cloud.Users.query(function (e) {
            if (e.success) {
                var data = [];
	            data.push({ title: 'Send Friend Request!' });
                for (var i = 0, l = e.users.length; i < l; i++) {
                    if (e.users[i].id != myID) {
                        var user = e.users[i];
                        var row = Ti.UI.createTableViewRow({
                            title: user.first_name + ' ' + user.last_name,
                            id: user.id
                        });
                        data.push(row);
                    }
                }
                if (data.length <= 1) {
	                table.setData([
		                { title: 'No Other Users' }
	                ]);
                } else {
	                table.setData(data);
                }
            }
            else {
                table.setData([
                    { title: (e.error && e.message) || e }
                ]);
                Utils.error(e);
            }
        })
    }

    win.addEventListener('open', function () {
        getMyID(queryUsers);
    });
    return win;
};