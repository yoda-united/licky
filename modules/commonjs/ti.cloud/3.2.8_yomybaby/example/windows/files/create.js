var WindowManager = require('helper/WindowManager');
var Utils = require('helper/Utils');
var Cloud = require('ti.cloud');
exports['Create File'] = function (evt) {
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

    var name = Ti.UI.createTextField({
        hintText: 'Name',
        top: 10 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u,
        height: 40 + Utils.u,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED
    });
    content.add(name);

	var fileName = Ti.UI.createTextField({
		hintText: 'File name',
		top: 10 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u,
		height: 40 + Utils.u,
		borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		value: 'sampleFile.txt'
	});
	content.add(fileName);

    var button = Ti.UI.createButton({
        title: 'Create',
        top: 10 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u, bottom: 10 + Utils.u,
        height: 40 + Utils.u
    });
    content.add(button);

    function submitForm() {
        button.hide();
		if (Ti.UI.createProgressBar) {
			uploadProgress.value = 0;
			Cloud.onsendstream = function (evt) {
				uploadProgress.value = evt.progress * 0.5;
			};
			Cloud.ondatastream = function (evt) {
				uploadProgress.value = (evt.progress * 0.5) + 0.5;
			};
		}
        Cloud.Files.create({
	        name: name.value,
	        // The example file is located in the windows/files subfolder of the project resources
	        file: Titanium.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, '/windows/files/' + fileName.value)
        }, function (e) {
	        Cloud.onsendstream = Cloud.ondatastream = null;
            if (e.success) {
                alert('Created!');
                name.value = '';
            } else {
                Utils.error(e);
            }
            button.show();
        });
    }

    button.addEventListener('click', submitForm);
    var fields = [ name, fileName ];
    for (var i = 0; i < fields.length; i++) {
        fields[i].addEventListener('return', submitForm);
    }

    win.addEventListener('open', function () {
        name.focus();
    });
    return win;
};