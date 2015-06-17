var WindowManager = require('helper/WindowManager');
var Utils = require('helper/Utils');
var Cloud = require('ti.cloud');
exports['Create Photo'] = function (evt) {

    var win = WindowManager.createWindow({
        backgroundColor: 'white'
    });

    var content = Ti.UI.createScrollView({
        top: 0,
        contentHeight: 'auto',
        layout: 'vertical'
    });
    win.add(content);


    if (Ti.UI.createProgressBar) {
        var uploadProgress = Ti.UI.createProgressBar({
            top: 10 + Utils.u, right: 10 + Utils.u, left: 10 + Utils.u,
            max: 1, min: 0, value: 0,
            height: 25 + Utils.u
        });
        content.add(uploadProgress);
        uploadProgress.show();
    }

    var photo;

    if (Ti.Media.openPhotoGallery) {
        var selectPhoto = Ti.UI.createButton({
            title: 'Select Photo from Gallery',
            top: 10 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u, bottom: 10 + Utils.u,
            height: 40 + Utils.u
        });
        selectPhoto.addEventListener('click', function (evt) {
            Ti.Media.openPhotoGallery({
                success: function (e) {
                    photo = e.media;
                }
            });
        });
        content.add(selectPhoto);
    }
    if (Ti.Media.showCamera) {
        var takePhoto = Ti.UI.createButton({
            title: 'Take Photo with Camera',
            top: 10 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u, bottom: 10 + Utils.u,
            height: 40 + Utils.u
        });
        takePhoto.addEventListener('click', function (evt) {
            Ti.Media.showCamera({
                success: function (e) {
                    photo = e.media;
                }
            });
        });
        content.add(takePhoto);
    }

    var collectionID;
    var chooseCollection = Ti.UI.createButton({
        title: 'Choose Collection',
        top: 10 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u, bottom: 10 + Utils.u,
        height: 40 + Utils.u
    });
    chooseCollection.addEventListener('click', function (evt) {
        var table = Ti.UI.createTableView({
            backgroundColor: '#fff',
            data: [
                { title: 'Loading, please wait...' }
            ]
        });
        table.addEventListener('click', function (evt) {
            collectionID = evt.row.id;
            win.remove(table);
        });
        win.add(table);

        function findCollections(userID) {
            Cloud.PhotoCollections.search({
                user_id: userID
            }, function (e) {
                if (e.success) {
                    if (e.collections.length == 0) {
                        win.remove(table);
                        alert('No photo collections exist! Create one first.');
                    }
                    else {
                        var data = [];
                        data.push(Ti.UI.createTableViewRow({
                            title: 'No Collection',
                            id: '',
                            hasCheck: !collectionID
                        }));
                        (function enumCollection(collections, prefix) {
                        	for (var i = 0, l = collections.length; i < l; i++) {
                        		data.push(Ti.UI.createTableViewRow({
                        			title: prefix + collections[i].name,
                        			id: collections[i].id,
                        			hasCheck: collectionID == collections[i].id
                        		}));
                        		if (collections[i].subcollections) {
                        			enumCollection(collections[i].subcollections, collections[i].name + ":");
                        		}
                        	}
                        })(e.collections, '');
                        table.setData(data);
                    }
                }
                else {
                    win.remove(table);
                    Utils.error(e);
                }
            });
        }

        Cloud.Users.showMe(function (e) {
            if (e.success) {
                findCollections(e.users[0].id);
            }
            else {
                table.setData([
                    { title: (e.error && e.message) || e }
                ]);
                Utils.error(e);
            }
        });
    });
    content.add(chooseCollection);

    var button = Ti.UI.createButton({
        title: 'Create',
        top: 10 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u, bottom: 10 + Utils.u,
        height: 40 + Utils.u
    });
    button.addEventListener('click', function (evt) {
        if (!photo) {
            alert('Please provide a photo!');
            return;
        }
        if (Ti.UI.createProgressBar) {
            Cloud.onsendstream = function (evt) {
                uploadProgress.value = evt.progress * 0.5;
            };
            Cloud.ondatastream = function (evt) {
                uploadProgress.value = (evt.progress * 0.5) + 0.5;
            };
        }
        Cloud.Photos.create({
            photo: photo,
            collection_id: collectionID,
            'photo_sync_sizes[]': 'small_240'
        }, function (e) {
            Cloud.onsendstream = Cloud.ondatastream = null;
            if (e.success) {
                photo = null;
                collectionID = null;
                alert('Uploaded!');
            }
            else {
                Utils.error(e);
            }
        });
    });
    content.add(button);

    return win;
};