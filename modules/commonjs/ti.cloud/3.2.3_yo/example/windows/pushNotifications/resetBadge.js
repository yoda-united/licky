windowFunctions['Reset Badge'] = function (evt) {
    var win = createWindow();
    var offset = addBackButton(win);
    var content = Ti.UI.createScrollView({
        top: offset + u,
        contentHeight: 'auto',
        layout: 'vertical'
    });
    win.add(content);

    var device_token = Ti.UI.createTextField({
        hintText: 'Device Token',
        top: 10 + u, left: 10 + u, right: 10 + u,
        height: 40 + u,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_NONE,
        autocorrect: false
    });
    content.add(device_token);

    var button = Ti.UI.createButton({
        title: 'Reset Badge',
        top: 10 + u, left: 10 + u, right: 10 + u, bottom: 10 + u,
        height: 40 + u
    });
    content.add(button);

    var fields = [ device_token ];

    function submitForm() {
        Cloud.PushNotifications.resetBadge({
            device_token: device_token.value
        }, function (e) {
            if (e.success) {
                device_token.value = '';
                alert('Badge Reset!');
            }
            else {
                error(e);
            }
            button.show();
        });
    }

    button.addEventListener('click', submitForm);
    for (var i = 0; i < fields.length; i++) {
        fields[i].addEventListener('return', submitForm);
    }

    win.addEventListener('open', function () {
        device_token.focus();
    });
    win.open();
};