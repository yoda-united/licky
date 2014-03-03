windowFunctions['Show Channels'] = function (evt) {
    var win = createWindow();
    var offset = addBackButton(win);

    var name = Ti.UI.createTextField({
        hintText: 'channel name',
        top: offset + 10 + u, left: 10 + u, right: 10 + u,
        height: 40 + u,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_NONE,
        autocorrect: false
    });
    offset += 50;
    win.add(name);
    
    var button = Ti.UI.createButton({
        title: 'Show Channels',
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
    name.addEventListener('return', submitQuery);
    
    function submitQuery() {
        Cloud.PushNotifications.showChannels({
            name: name.value
        },function (e) {
            if (e.success) {
                var data = [];
                var row = Ti.UI.createTableViewRow({
                    layout: 'vertical'
                });
                enumerateProperties(row, e.devices, 20);
                data.push(row);
                table.setData(data);
            }
            else {
                error(e);
            }
        });
    }    

    win.open();
};