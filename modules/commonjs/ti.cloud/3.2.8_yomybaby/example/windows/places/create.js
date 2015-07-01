var WindowManager = require('helper/WindowManager');
var Utils = require('helper/Utils');
var Cloud = require('ti.cloud');
exports['Create Place'] = function (evt) {
    var win = WindowManager.createWindow({
        backgroundColor: 'white'
    });
    var content = Ti.UI.createScrollView({
        top: 0,
        contentHeight: 'auto',
        layout: 'vertical'
    });
    win.add(content);

    var name = Ti.UI.createTextField({
        hintText: 'Name',
        top: 10 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u,
        height: 40 + Utils.u,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED
    });
    content.add(name);

    var address = Ti.UI.createTextField({
        hintText: 'Address',
        top: 10 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u,
        height: 40 + Utils.u,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED
    });
    content.add(address);

    var city = Ti.UI.createTextField({
        hintText: 'City',
        top: 10 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u,
        height: 40 + Utils.u,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED
    });
    content.add(city);

    var state = Ti.UI.createTextField({
        hintText: 'State',
        top: 10 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u,
        height: 40 + Utils.u,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED
    });
    content.add(state);

    var postalCode = Ti.UI.createTextField({
        hintText: 'Postal Code',
        top: 10 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u,
        height: 40 + Utils.u,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        keyboardType: Ti.UI.KEYBOARD_NUMBER_PAD
    });
    content.add(postalCode);

    var button = Ti.UI.createButton({
        title: 'Create',
        top: 10 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u, bottom: 10 + Utils.u,
        height: 40 + Utils.u
    });
    content.add(button);


    function submitForm() {
        button.hide();

        Cloud.Places.create({
            name: name.value,
            address: address.value,
            city: city.value,
            state: state.value,
            postal_code: postalCode.value
        }, function (e) {
            if (e.success) {
                alert('Created!');
                name.value = address.value = city.value = state.value = postalCode.value = '';
            }
            else {
                Utils.error(e);
            }
            button.show();
        });
    }

    button.addEventListener('click', submitForm);
    var fields = [ name, address, city, state, postalCode ];
    for (var i = 0; i < fields.length; i++) {
        fields[i].addEventListener('return', submitForm);
    }

    win.addEventListener('open', function () {
        name.focus();
    });
    return win;
};