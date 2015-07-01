var WindowManager = require('helper/WindowManager');
var Utils = require('helper/Utils');
var Cloud = require('ti.cloud');
exports['Update GeoFence'] = function (evt) {
    var geo_fence_id = evt.id;
    var win = WindowManager.createWindow({
        backgroundColor: 'white'
    });
    var content = Ti.UI.createScrollView({
        top: 0,
        contentHeight: 'auto',
        layout: 'vertical'
    });
    win.add(content);

    var geo_fence = Ti.UI.createTextField({
        hintText: 'geo_fence',
        top: 10 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u,
        height: 40 + Utils.u,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED
    });
    content.add(geo_fence);

    var updateButton = Ti.UI.createButton({
        title: 'Update',
        top: 10 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u, bottom: 10 + Utils.u,
        height: 40 + Utils.u
    });
    content.add(updateButton);

    var remove = Ti.UI.createButton({
        title: 'Remove',
        top: 10 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u, bottom: 10 + Utils.u,
        height: 40 + Utils.u
    });
    remove.addEventListener('click', function () {
        WindowManager.handleOpenWindow({ target: 'Remove Geo Fence', id: evt.id });
    });
    content.add(remove);

    var fields = [ geo_fence ];

    function submitForm() {
        for (var i = 0; i < fields.length; i++) {
            if (!fields[i].value.length) {
                fields[i].focus();
                return;
            }
            fields[i].blur();
        }
        updateButton.hide();

        var params = {
            id: geo_fence_id,
            geo_fence: geo_fence.value
        };

        Cloud.GeoFences.update(params, function (e) {
            if (e.success) {
                alert('Updated!');
            } else {
                Utils.error(e);
            }
            updateButton.show();
        });
    }

    updateButton.addEventListener('click', submitForm);
    for (var i = 0; i < fields.length; i++) {
        fields[i].addEventListener('return', submitForm);
    }

    win.addEventListener('open', function () {
        geo_fence.focus();
    });
    return win;
};