windowFunctions['Update GeoFence'] = function (evt) {
    var geo_fence_id = evt.id;
    var payload = evt.payload;
    var loc = evt.loc;
    var win = createWindow();
    var offset = addBackButton(win);
    var content = Ti.UI.createScrollView({
        top: offset + u,
        contentHeight: 'auto',
        layout: 'vertical'
    });
    win.add(content);

    var name = Ti.UI.createTextField({
        hintText: 'name',
        top: 10 + u, left: 10 + u, right: 10 + u,
        height: 40 + u,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED
    });
    content.add(name);

    var latitude = Ti.UI.createTextField({
        hintText: 'latitude',
        top: 10 + u, left: 10 + u, right: 10 + u,
        height: 40 + u,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED
    });
    content.add(latitude);

    var longitude = Ti.UI.createTextField({
        hintText: 'longitude',
        top: 10 + u, left: 10 + u, right: 10 + u,
        height: 40 + u,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED
    });
    content.add(longitude);

    var radius = Ti.UI.createTextField({
        hintText: 'radius',
        top: 10 + u, left: 10 + u, right: 10 + u,
        height: 40 + u,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED
    });
    content.add(radius);

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

    var fields = [ name, latitude, longitude, radius ];

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
            geo_fence: {
                loc: {
                    coordinates: [parseFloat(longitude.value), parseFloat(latitude.value)],
                    radius: radius.value
                },
                payload: {
                    name: name.value
                }
            }
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
        name.value = payload.name;
        latitude.value = loc.coordinates[1];
        longitude.value = loc.coordinates[0];
        radius.value = loc.radius;
    });
    win.open();
};