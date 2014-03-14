windowFunctions['Update GeoFence'] = function (evt) {
    var geo_fence_id = evt.id;
    var win = createWindow();
    var offset = addBackButton(win);
    var content = Ti.UI.createScrollView({
        top: offset + u,
        contentHeight: 'auto',
        layout: 'vertical'
    });
    win.add(content);

    var geo_fence = Ti.UI.createTextField({
        hintText: 'geo_fence',
        top: 10 + u, left: 10 + u, right: 10 + u,
        height: 40 + u,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED
    });
    content.add(geo_fence);

    var updateButton = Ti.UI.createButton({
        title: 'Update',
        top: 10 + u, left: 10 + u, right: 10 + u, bottom: 10 + u,
        height: 40 + u
    });
    content.add(updateButton);

    var remove = Ti.UI.createButton({
        title: 'Remove',
        top: 10 + u, left: 10 + u, right: 10 + u, bottom: 10 + u,
        height: 40 + u
    });
    remove.addEventListener('click', function () {
        handleOpenWindow({ target: 'Remove Geo Fence', id: evt.id });
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
                error(e);
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
    win.open();
};