var WindowManager = require('helper/WindowManager');
var Utils = require('helper/Utils');
var Cloud = require('ti.cloud');
exports['Show Photo Collection'] = function (evt) {
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
        text: 'Loading, please wait...', textAlign: 'left',
        height: 30 + Utils.u, left: 20 + Utils.u, right: 20 + Utils.u
    });
    content.add(status);

    Cloud.PhotoCollections.show({
        collection_id: evt.id
    }, function (e) {
        content.remove(status);

        if (e.success) {

            var collection = e.collections[0];

            if (collection.counts.photos) {
                var showPhotos = Ti.UI.createButton({
                    title: 'Show Photos',
                    top: 10 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u, bottom: 10 + Utils.u,
                    height: 40 + Utils.u
                });
                showPhotos.addEventListener('click', function () {
                    WindowManager.handleOpenWindow({ target: 'Show Collection\'s Photos', id: evt.id });
                });
                content.add(showPhotos);
            }
            if (collection.counts.subcollections) {
                var showSubcollections = Ti.UI.createButton({
                    title: 'Show Subcollections',
                    top: 10 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u, bottom: 10 + Utils.u,
                    height: 40 + Utils.u
                });
                showSubcollections.addEventListener('click', function () {
                    WindowManager.handleOpenWindow({ target: 'Show Subcollections', id: evt.id });
                });
                content.add(showSubcollections);
            }

            var update = Ti.UI.createButton({
                title: 'Update',
                top: 10 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u, bottom: 10 + Utils.u,
                height: 40 + Utils.u
            });
            update.addEventListener('click', function () {
                WindowManager.handleOpenWindow({ target: 'Update Photo Collection', id: evt.id });
            });
            content.add(update);

            var remove = Ti.UI.createButton({
                title: 'Remove',
                top: 10 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u, bottom: 10 + Utils.u,
                height: 40 + Utils.u
            });
            remove.addEventListener('click', function () {
                WindowManager.handleOpenWindow({ target: 'Remove Photo Collection', id: evt.id });
            });
            content.add(remove);

            Utils.enumerateProperties(content, collection, 20);
        }
        else {
            Utils.error(e);
        }
    });

    return win;
};