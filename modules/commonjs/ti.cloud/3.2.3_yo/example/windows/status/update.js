windowFunctions['Update Status'] = function (evt) {
    var status_id = evt.id;
    var win = createWindow();
    var offset = addBackButton(win);
    var content = Ti.UI.createScrollView({
        top: offset + u,
        contentHeight: 'auto',
        layout: 'vertical'
    });
    win.add(content);

    var message = Ti.UI.createTextField({
        hintText: 'Message',
        top: 10 + u, left: 10 + u, right: 10 + u,
        height: 40 + u,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED
    });
    content.add(message);

    var photo;

    if (Ti.Media.openPhotoGallery) {
        var selectPhoto = Ti.UI.createButton({
            title: 'Select Photo from Gallery',
            top: 10 + u, left: 10 + u, right: 10 + u, bottom: 10 + u,
            height: 40 + u
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
            top: 10 + u, left: 10 + u, right: 10 + u, bottom: 10 + u,
            height: 40 + u
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
        title: 'Update',
        top: 10 + u, left: 10 + u, right: 10 + u, bottom: 10 + u,
        height: 40 + u
    });
    content.add(button);
    
    var showButton = Ti.UI.createButton({
        title: 'Show',
        top: 10 + u, left: 10 + u, right: 10 + u, bottom: 10 + u,
        height: 40 + u
    });
    content.add(showButton);
    
    var deleteButton = Ti.UI.createButton({
        title: 'Delete',
        top: 10 + u, left: 10 + u, right: 10 + u, bottom: 10 + u,
        height: 40 + u
    });
    content.add(deleteButton);

    if (Ti.UI.createProgressBar) {
        var uploadProgress = Ti.UI.createProgressBar({
            top: 10 + u, right: 10 + u, left: 10 + u,
            max: 1, min: 0, value: 0,
            height: 25 + u
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

        Cloud.Statuses.update({
            status_id: status_id,
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
                error(e);
            }
            button.show();
        });
    }
    
    function showStatus(evt) {
        handleOpenWindow({ target: 'Show Status', id:status_id });
    }
    
    function deleteStatus(evt) {
        handleOpenWindow({ target: 'Remove Status', id:status_id });
    }

    button.addEventListener('click', submitForm);
    showButton.addEventListener('click', showStatus);
    deleteButton.addEventListener('click', deleteStatus);
    for (var i = 0; i < fields.length; i++) {
        fields[i].addEventListener('return', submitForm);
    }
    

    win.addEventListener('open', function () {
        message.focus();
    });
    win.open();
};