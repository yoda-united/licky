windowFunctions['Query Status'] = function (evt) {
    var win = createWindow();
    var offset = addBackButton(win);

    var table = Ti.UI.createTableView({
        backgroundColor: '#fff',
        top: offset + u, bottom: 0,
        data: [
            { title: 'Loading, please wait...' }
        ]
    });
    win.add(table);
    
    table.addEventListener('click', function (evt) {
        if (evt.row.id) {
            handleOpenWindow({ target: 'Update Status', id: evt.row.id });
        }
    });

    win.addEventListener('focus', function () {
        table.setData([{ title: 'Loading, please wait...' }]);
        Cloud.Statuses.query(function (e) {
            if (e.success) {
                if (e.statuses.length == 0) {
                    table.setData([
                        { title: 'No Results!' }
                    ]);
                }
                else {
                    var data = [];
                    for (var i = 0, l = e.statuses.length; i < l; i++) {
                        data.push(Ti.UI.createTableViewRow({
                            title: e.statuses[i].message,
                            id: e.statuses[i].id
                        }));
                    }
                    table.setData(data);
                }
            }
            else {
                error(e);
            }
        });
    });
    win.open();
};