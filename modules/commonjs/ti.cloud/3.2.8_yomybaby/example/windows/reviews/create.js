var WindowManager = require('helper/WindowManager');
var Utils = require('helper/Utils');
var Cloud = require('ti.cloud');
exports['Create Review'] = function (evt) {
    var win = WindowManager.createWindow({
        backgroundColor: 'white'
    });
    var content = Ti.UI.createScrollView({
        top: 0,
        contentHeight: 'auto',
        layout: 'vertical'
    });
    win.add(content);

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
        }
        else {
            Utils.error(e);
            status.text = (e.error && e.message) || e;
        }
    });

    var contentText = Ti.UI.createTextField({
        hintText: 'Content',
        top: 10 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u,
        height: 40 + Utils.u,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED
    });
    content.add(contentText);

    var rating = Ti.UI.createSlider({
        value: 5, min: 1, max: 5,
        top: 10 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u,
        height: 40 + Utils.u
    });
    content.add(rating);

    var button = Ti.UI.createButton({
        title: 'Create',
        top: 10 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u, bottom: 10 + Utils.u,
        height: 40 + Utils.u
    });
    content.add(button);

    function submitForm() {
        button.hide();

        Cloud.Reviews.create({
            user_id: userID,
            content: contentText.value,
            rating: rating.value,
            allow_duplicate: 1
        }, function (e) {
            if (e.success) {
                alert('Created!');
                contentText.value = '';
            }
            else {
                Utils.error(e);
            }
            button.show();
        });
    }

    button.addEventListener('click', submitForm);
    var fields = [ contentText ];
    for (var i = 0; i < fields.length; i++) {
        fields[i].addEventListener('return', submitForm);
    }

    win.addEventListener('open', function () {
        contentText.focus();
    });
    return win;
};