var WindowManager = require('helper/WindowManager');
var Utils = require('helper/Utils');
var Cloud = require('ti.cloud');
exports['Search Photo'] = function (evt) {
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
            WindowManager.handleOpenWindow({ target: 'Show Photo', id: evt.row.id });
        }
    });
    win.add(table);

    function findPhotos(userID) {
        Cloud.Photos.search({
            user_id: userID
        }, function (e) {
            if (e.success) {
                if (e.photos.length == 0) {
                    table.setData([
                        { title: 'No Results!' }
                    ]);
                }
                else {
                    var data = [];
                    for (var i = 0, l = e.photos.length; i < l; i++) {
                        data.push(Ti.UI.createTableViewRow({
                            title: e.photos[i].filename,
                            id: e.photos[i].id
                        }));
                    }
                    table.setData(data);
                }
            }
            else {
                Utils.error(e);
            }
        });
    }

    function findMe() {
        Cloud.Users.showMe(function (e) {
            if (e.success) {
                findPhotos(e.users[0].id);
            }
            else {
                table.setData([
                    { title: (e.error && e.message) || e }
                ]);
                Utils.error(e);
            }
        });
    }

    win.addEventListener('open', function () {
        findMe();
    });
    return win;
};