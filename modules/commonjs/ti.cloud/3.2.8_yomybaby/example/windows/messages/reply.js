var WindowManager = require('helper/WindowManager');
var Utils = require('helper/Utils');
var Cloud = require('ti.cloud');
exports['Reply Message'] = function (evt) {
    var win = WindowManager.createWindow({
        backgroundColor: 'white'
    });
    var content = Ti.UI.createScrollView({
        top: 0,
        contentHeight: 'auto',
        layout: 'vertical'
    });
    win.add(content);

	var subject = Ti.UI.createTextField({
		top: 10 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u,
		height: 40 + Utils.u,
		borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		editable: false,
		ellipsize: true,
		value: evt.subject || ""
	});
	content.add(subject);

	var body = Ti.UI.createTextArea({
		hintText: 'Body',
		top: 10 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u,
		height: 120 + Utils.u,
      	borderWidth: 2,
      	borderColor: '#bbb',
      	borderRadius: 5,
      	font: {fontSize:20 }
	});
	content.add(body);

    var replyButton = Ti.UI.createButton({
        title: 'Reply',
        top: 10 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u, bottom: 10 + Utils.u,
        height: 40 + Utils.u
    });
    replyButton.addEventListener('click', function () {
    	replyButton.hide();
        Cloud.Messages.reply({
	        message_id: evt.id,
	        body: body.value
        }, function (e) {
            if (e.success) {
                alert('Replied!');
	            body.value = '';
            } else {
                Utils.error(e);
            }
            replyButton.show();
        });
    });
    content.add(replyButton);

    win.addEventListener('open', function () {
        body.focus();
    });

    return win;
};