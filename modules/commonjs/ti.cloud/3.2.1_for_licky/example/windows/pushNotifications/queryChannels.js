windowFunctions['Query Channels'] = function (evt) {
    var win = createWindow();
    var offset = addBackButton(win);    
    var content = Ti.UI.createScrollView({
        top: offset + u,
        contentHeight: 'auto',
        layout: 'vertical'
    });
    win.add(content);

    win.addEventListener('open', submitQuery);
    
    function submitQuery() {
        Cloud.PushNotifications.queryChannels(function (e) {
            if (e.success) {
                if (e.push_channels.length == 0) {
                    content.add(Ti.UI.createLabel({
                        text: 'No Results!', textAlign: 'left',
                        height: 30 + u, left: 20 + u, right: 20 + u
                    }));
                } else {
                    content.add(Ti.UI.createLabel({
                        text: 'Channels:', textAlign: 'left',
                        height: 30 + u, left: 20 + u, right: 20 + u
                    }));
                    enumerateProperties(content, e.push_channels, 20);
                }
            }
            else {
                error(e);
            }
        });
    }    

    win.open();
};