var WindowManager = require('helper/WindowManager');
var Utils = require('helper/Utils');
var Cloud = require('ti.cloud');
exports['Query Review'] = function (evt) {
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
            WindowManager.handleOpenWindow({ target: 'Show Review', user_id: userID, review_id: evt.row.id });
        }
    });
    win.add(table);

    var status = Ti.UI.createLabel({
        text: 'Loading, please wait...', textAlign: 'center',
        color: '#000', backgroundColor: '#fff',
        top: 0
    });
    win.add(status);

    var userID;
    Cloud.Users.showMe(function (e) {
        if (e.success) {
            win.remove(status);
            userID = e.users[0].id;

            Cloud.Reviews.query({
                user_id: userID
            }, function (e) {
                if (e.success) {
                    if (e.reviews.length == 0) {
                        table.setData([
                            { title: 'No Results!' }
                        ]);
                    }
                    else {
                        var data = [];
                        for (var i = 0, l = e.reviews.length; i < l; i++) {
                            data.push(Ti.UI.createTableViewRow({
                                title: e.reviews[i].rating + ', ' + e.reviews[i].content,
                                id: e.reviews[i].id
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
        else {
            Utils.error(e);
            status.text = (e.error && e.message) || e;
        }
    });

    return win;
};