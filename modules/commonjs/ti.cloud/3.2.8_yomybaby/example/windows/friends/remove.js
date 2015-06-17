var WindowManager = require('helper/WindowManager');
var Utils = require('helper/Utils');
var Cloud = require('ti.cloud');
exports['Remove Friends'] = function (evt) {
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
	        alert('No friends selected');
	    } else {
			Cloud.Friends.remove({
				user_ids: checked.join(",")
			}, function(e) {
	            if (e.success) {
	                alert('Friend(s) removed');
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

    function searchFriends(myID) {
        Cloud.Friends.search({
	        user_id: myID
        }, function (e) {
            if (e.success) {
	            if (e.users.length == 0) {
		            table.setData([
			            { title: 'No friends' }
		            ]);
	            } else {
	                var data = [];
		            data.push({ title: 'Remove Friend(s)!' });
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
        getMyID(searchFriends);
    });
    return win;

};