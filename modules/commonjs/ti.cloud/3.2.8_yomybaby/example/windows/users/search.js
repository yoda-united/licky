var WindowManager = require('helper/WindowManager');
var Utils = require('helper/Utils');
var Cloud = require('ti.cloud');
exports['Search User'] = function (evt) {
    var win = WindowManager.createWindow({
        backgroundColor: 'white'
    });

    var search = Ti.UI.createTextField({
        hintText: 'Full Text Search',
        top: 10 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u,
        height: 40 + Utils.u,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED
    });
    win.add(search);

    var button = Ti.UI.createButton({
        title: 'Search',
        top: 60 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u,
        height: 40 + Utils.u
    });
    win.add(button);

    var table = Ti.UI.createTableView({
        backgroundColor: '#fff',
        top: 110 + Utils.u, bottom: 0
    });
    table.addEventListener('click', function (evt) {
        if (evt.row.id) {
            WindowManager.handleOpenWindow({ target: 'Show User', id: evt.row.id });
        }
    });
    win.add(table);

    function submitForm() {
        if (!search.value.length) {
            search.focus();
            return;
        }
        search.blur();
        button.hide();

        Cloud.Users.search({
                q: search.value
            }, function (e) {
                button.show();
                if (e.success) {
                    if (e.users.length == 0) {
                        table.setData([
                            { title: 'No Results!' }
                        ]);
                    }
                    else {
                        var data = [];
                        for (var i = 0, l = e.users.length; i < l; i++) {
                            data.push(Ti.UI.createTableViewRow({
                                title: e.users[i].first_name + ' ' + e.users[i].last_name,
                                id: e.users[i].id
                            }));
                        }
                        table.setData(data);
                    }
                }
                else {
                    Utils.error(e);
                }
            }
        );
    }

    button.addEventListener('click', submitForm);
    search.addEventListener('return', submitForm);

    win.addEventListener('open', function () {
        search.focus();
    });
    return win;
};