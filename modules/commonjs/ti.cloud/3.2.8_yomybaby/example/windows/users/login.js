var WindowManager = require('helper/WindowManager');
var Utils = require('helper/Utils');
var Cloud = require('ti.cloud');
exports['Login User'] = function (evt) {
    var win = WindowManager.createWindow({
        backgroundColor: 'white'
    });
    var content = Ti.UI.createScrollView({
        top: 0,
        contentHeight: Ti.UI.SIZE,
        layout: 'vertical'
    });
    win.add(content);

    var login = Ti.UI.createTextField({
        hintText: 'Login',
        top: 10 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u,
        height: 40 + Utils.u,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_NONE,
        autocorrect: false
    });
    content.add(login);

    var password = Ti.UI.createTextField({
        hintText: 'Password',
        top: 10 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u,
        height: 40 + Utils.u,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        passwordMask: true
    });
    content.add(password);

    var button = Ti.UI.createButton({
        title: 'Login User',
        top: 10 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u,
        height: 40 + Utils.u
    });
    if(!Utils.blackberry) {
        button.bottom = 10 + Utils.u;
    }
    content.add(button);

    var fields = [ login, password ];

    function submitForm() {
        for (var i = 0; i < fields.length; i++) {
            if (!fields[i].value.length) {
                fields[i].focus();
                return;
            }
            fields[i].blur();
        }
        button.hide();

        Cloud.Users.login({
            login: login.value,
            password: password.value
        }, function (e) {
            if (e.success) {
                var user = e.users[0];
                login.value = password.value = '';
                alert('Logged in! You are now logged in as ' + user.id);
            }
            else {
                Utils.error(e);
            }
            button.show();
        });
    }

    button.addEventListener('click', submitForm);
    for (var i = 0; i < fields.length; i++) {
        fields[i].addEventListener('return', submitForm);
    }

    win.addEventListener('open', function () {
        login.focus();
    });
    return win;
};