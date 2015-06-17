var WindowManager = require('helper/WindowManager');
var Utils = require('helper/Utils');
var Cloud = require('ti.cloud');
exports['Show Message'] = function (evt) {
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

    Cloud.Messages.show({
        message_id: evt.id
    }, function (e) {
        content.remove(status);
	    if (e.success) {
		    if (evt.allowReply) {
		        var reply = Ti.UI.createButton({
		            title: 'Reply',
		            top: 10 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u, bottom: 10 + Utils.u,
		            height: 40 + Utils.u
		        });
		        reply.addEventListener('click', function () {
		            WindowManager.handleOpenWindow({ target: 'Reply Message', id: evt.id, subject: e.messages[0].subject });
		        });
		        content.add(reply);
		    }

	        var remove = Ti.UI.createButton({
	            title: 'Remove Message',
	            top: 10 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u, bottom: 10 + Utils.u,
	            height: 40 + Utils.u
	        });
	        remove.addEventListener('click', function () {
	            WindowManager.handleOpenWindow({ target: 'Remove Message', id: evt.id });
	        });
	        content.add(remove);

            Utils.enumerateProperties(content, e.messages[0], 20);
        } else {
            Utils.error(e);
        }
    });

    return win;
};