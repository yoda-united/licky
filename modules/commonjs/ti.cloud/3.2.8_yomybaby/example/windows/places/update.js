var WindowManager = require('helper/WindowManager');
var Utils = require('helper/Utils');
var Cloud = require('ti.cloud');
exports['Update Place'] = function (evt) {
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
        title: 'Update',
        top: 10 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u, bottom: 10 + Utils.u,
        height: 40 + Utils.u
    });
    content.add(button);

    function submitForm() {
        button.hide();

        Cloud.Places.update({
            place_id: evt.id,
            name: name.value,
            address: address.value,
            city: city.value,
            state: state.value,
            postal_code: postalCode.value
        }, function (e) {
            if (e.success) {
                alert('Updated!');
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

    var status = Ti.UI.createLabel({
        text: 'Loading, please wait...', textAlign: 'center',
        top: 0, right: 0, bottom: 0, left: 0,
        backgroundColor: '#fff', zIndex: 2
    });
    win.add(status);

    win.addEventListener('open', function () {
        Cloud.Places.show({
            place_id: evt.id
        }, function (e) {
            status.hide();
            if (e.success) {
                var place = e.places[0];
                name.value = place.name;
                address.value = place.address;
                city.value = place.city;
                state.value = place.state;
                postalCode.value = place.postal_code;
                name.focus();
            }
            else {
                Utils.error(e);
            }
        });
    });
    return win;
};