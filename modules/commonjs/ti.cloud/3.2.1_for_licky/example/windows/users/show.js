windowFunctions['Show User'] = function (evt) {
    var userId;
    var win = createWindow();
    var offset = addBackButton(win);
    var button = Ti.UI.createButton({
        title: 'Copy User ID',
        top: offset + 10 + u, left: 10 + u, right: 10 + u, bottom: 10 + u,
        height: 40 + u
    });
    offset += 50;
    win.add(button);
    var content = Ti.UI.createScrollView({
        top: offset + u, bottom: 0,
        contentHeight: 'auto',
        layout: 'vertical'
    });
    win.add(content);

    var status = Ti.UI.createLabel({
        text: 'Loading, please wait...', textAlign: 'left',
        height: 30 + u, left: 20 + u, right: 20 + u
    });
    content.add(status);

    button.addEventListener('click', function() {
        if (userId) {
            alert('User id ' + userId + ' copied to clipboard.');
            Ti.UI.Clipboard.setText(userId);
        }
    });

    Cloud.Users.show({
        user_id: evt.id
    }, function (e) {
        content.remove(status);
        if (e.success) {
            enumerateProperties(content, e.users[0], 20);
            userId = e.users[0].id;
        }
        else {
            error(e);
        }
    });

    win.open();
};