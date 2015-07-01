var WindowManager = require('helper/WindowManager');
var Utils = require('helper/Utils');
var Cloud = require('ti.cloud');
exports['Create Status'] = function (evt) {
    var win = WindowManager.createWindow({
        backgroundColor: 'white'
    });
    var content = Ti.UI.createScrollView({
        top: 0,
        contentHeight: 'auto',
        layout: 'vertical'
    });
    win.add(content);

    var message = Ti.UI.createTextField({
        hintText: 'Message',
        top: 10 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u,
        height: 40 + Utils.u,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED
    });
    content.add(message);

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

    var button = Ti.UI.createButton({
        title: 'Create',
        top: 10 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u, bottom: 10 + Utils.u,
        height: 40 + Utils.u
    });
    content.add(button);

    if (Ti.UI.createProgressBar) {
        var uploadProgress = Ti.UI.createProgressBar({
            top: 10 + Utils.u, right: 10 + Utils.u, left: 10 + Utils.u,
            max: 1, min: 0, value: 0,
            height: 25 + Utils.u
        });
        content.add(uploadProgress);
        uploadProgress.show();
    }

    var fields = [ message ];

    function submitForm() {
        for (var i = 0; i < fields.length; i++) {
            if (!fields[i].value.length) {
                fields[i].focus();
                return;
            }
            fields[i].blur();
        }
        button.hide();

        if (photo && Ti.UI.createProgressBar) {
            Cloud.onsendstream = function (evt) {
                uploadProgress.value = evt.progress * 0.5;
            };
            Cloud.ondatastream = function (evt) {
                uploadProgress.value = (evt.progress * 0.5) + 0.5;
            };
        }

        Cloud.Statuses.create({
            message: message.value,
            photo: photo
        }, function (e) {
            if (photo && Ti.UI.createProgressBar) {
                Cloud.onsendstream = Cloud.ondatastream = null;
            }
            if (e.success) {
                message.value = '';
                photo = null;
                alert('Updated!');
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
        message.focus();
    });
    return win;
};