windowFunctions['Query Subscriptions'] = function (evt) {
    var win = createWindow();
    var offset = addBackButton(win);

    var userId = Ti.UI.createTextField({
        hintText: 'user_id',
        top: offset + 10 + u, left: 10 + u, right: 10 + u,
        height: 40 + u,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_NONE,
        autocorrect: false
    });
    offset += 50;
    win.add(userId);
    
    var button = Ti.UI.createButton({
        title: 'Query Subscriptions',
        top: offset + 10 + u, left: 10 + u, right: 10 + u, bottom: 10 + u,
        height: 40 + u
    });
    offset += 50;
    win.add(button);
    
    var table = Ti.UI.createTableView({
        backgroundColor: '#fff',
        top: offset + u, bottom: 0,
        data: []
    });
    win.add(table);

    button.addEventListener('click', submitQuery);
    userId.addEventListener('return', submitQuery);
    
    function submitQuery() {
        Cloud.PushNotifications.query({
            user_id: userId.value
        },function (e) {
            if (e.success) {
                if (e.subscriptions.length == 0) {
                    table.setData([
                        { title: 'No Results!' }
                    ]);
                }
                else {
                    var data = [];
                    var row;
                    for (var i = 0, l = e.subscriptions.length; i < l; i++) {
                        row = Ti.UI.createTableViewRow({
                            layout: 'vertical'
                        });
                        enumerateProperties(row, e.subscriptions[i], 20);
                        data.push(row);
                    }
                    table.setData(data);
                }
            }
            else {
                error(e);
            }
        });
    }    

    win.open();
};
