var WindowManager = require('helper/WindowManager');
var Utils = require('helper/Utils');
var Cloud = require('ti.cloud');
exports['Show ACL'] = function (evt) {
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
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_NONE,
        autocorrect: false
    });
    content.add(name);

	var readers = { 
		publicAccess: false,
		ids: []
	};
    var readersButton = Ti.UI.createButton({
        title: 'Select Readers',
        top: 10 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u, bottom: 10 + Utils.u,
        height: 40 + Utils.u
    });
    readersButton.addEventListener('click', function submitForm() {
	    WindowManager.handleOpenWindow({ target: 'Select Users for ACL', access: readers });
    });
    content.add(readersButton);

	var writers = {
		publicAccess: false,
		ids: []
	};
    var writersButton = Ti.UI.createButton({
        title: 'Select Writers',
        top: 0, left: 10 + Utils.u, right: 10 + Utils.u, bottom: 10 + Utils.u,
        height: 40 + Utils.u
    });
    writersButton.addEventListener('click', function (evt) {
	    WindowManager.handleOpenWindow({ target: 'Select Users for ACL', access: writers });
    });
    content.add(writersButton);

    var showButton = Ti.UI.createButton({
        title: 'Show',
        top: 0, left: 10 + Utils.u, right: 10 + Utils.u, bottom: 10 + Utils.u,
        height: 40 + Utils.u
    });
    showButton.addEventListener('click', function (evt) {
    	if (name.value.length == 0) {
    		name.focus();
    		return;
    	}
    	Cloud.ACLs.show({
            name: name.value
        }, function (e) {
            if (e.success) {
            	var acls = e.acls[0];
            	readers.publicAccess = acls.public_read || false;
            	readers.ids = acls.readers || [];
            	writers.publicAccess = acls.public_write || false;
            	writers.ids = acls.writers || [];
            	alert('Shown!');
            } else {
                Utils.error(e);
            }
        });
    });
    content.add(showButton);   
    
    var updateButton = Ti.UI.createButton({
        title: 'Update',
        top: 0, left: 10 + Utils.u, right: 10 + Utils.u, bottom: 10 + Utils.u,
        height: 40 + Utils.u
    });
    updateButton.addEventListener('click', function (evt) {
        Cloud.ACLs.update({
            name: name.value,
            reader_ids: readers.ids.join(','),
            writer_ids: writers.ids.join(','),
            public_read: readers.publicAccess,
            public_write: writers.publicAccess
        }, function (e) {
            if (e.success) {
                alert('Updated!');
            } else {
                Utils.error(e);
            }
         });
    });
    content.add(updateButton);
    
    var removeButton = Ti.UI.createButton({
        title: 'Remove',
        top: 0, left: 10 + Utils.u, right: 10 + Utils.u, bottom: 10 + Utils.u,
        height: 40 + Utils.u
    });
    removeButton.addEventListener('click', function (evt) {
        Cloud.ACLs.remove({
            name: name.value
        }, function (e) {
            if (e.success) {
                alert('Removed!');
            } else {
                Utils.error(e);
            }
        });
    });
    content.add(removeButton);    
    
    win.addEventListener('open', function () {
        name.focus();
    });
    return win;
};