var WindowManager = require('helper/WindowManager');
var Utils = require('helper/Utils');
var Cloud = require('ti.cloud');

exports['Generic Send Request'] = function (evt) {
    var win = WindowManager.createWindow();
    var offset = addBackButton(win);
    var content = Ti.UI.createScrollView({
        contentHeight: Ti.UI.SIZE,
        layout: 'vertical'
    });
    win.add(content);

    var url = Ti.UI.createTextField({
        hintText: 'url (users/query.json)',
        value: 'users/query.json',
        top: 10 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u,
        height: 40 + Utils.u,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_NONE,
        autocorrect: false
    });
    content.add(url);

    var method = Ti.UI.createTextField({
        hintText: 'method (GET)',
        value: 'GET',
        top: 10 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u,
        height: 40 + Utils.u,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_NONE,
        autocorrect: false
    });
    content.add(method);

    var data = Ti.UI.createTextField({
        hintText: 'data ({"where":{"first_name":"joe"}})',
        value: '{"where":{"first_name":"joe"}}',
        top: 10 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u,
        height: 40 + Utils.u,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_NONE,
        autocorrect: false
    });
    content.add(data);

    var button = Ti.UI.createButton({
        title: 'Send',
        top: 10 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u, bottom: 10 + Utils.u,
        height: 40 + Utils.u
    });
    content.add(button);

    var fields = [ url, method ];

    function submitForm() {
        for (var i = 0; i < fields.length; i++) {
            if (!fields[i].value.length) {
                fields[i].focus();
                return;
            }
            fields[i].blur();
        }
        button.hide();

        Cloud.sendRequest({
            url: url.value,
            method: method.value,
            data: data.value ? JSON.parse(data.value) : null
        }, function (e) {
            if (e.success) {
                alert('Success! See log for response.');
                Ti.API.info('Reponse: ' + JSON.stringify(e));
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
        url.focus();
    });
    return win;
};