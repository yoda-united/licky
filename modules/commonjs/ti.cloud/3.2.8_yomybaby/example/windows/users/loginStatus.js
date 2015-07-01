var WindowManager = require('helper/WindowManager');
var Utils = require('helper/Utils');
var Cloud = require('ti.cloud');
exports['Login Status'] = function () {
	var win = WindowManager.createWindow({
        backgroundColor: 'white'
    });
	var content = Ti.UI.createScrollView({
		top: 0,
		contentHeight: 'auto',
		layout: 'vertical'
	});
	win.add(content);

	content.add(Ti.UI.createLabel({
			text: 'accessToken: ' + Cloud.accessToken, textAlign: 'left',
			height: 40 + Utils.u, left: 20 + Utils.u, right: 20 + Utils.u
	}));
	content.add(Ti.UI.createLabel({
			text: 'expiresIn: ' + Cloud.expiresIn, textAlign: 'left',
			height: 40 + Utils.u, left: 20 + Utils.u, right: 20 + Utils.u
	}));
	content.add(Ti.UI.createLabel({
			text: 'sessionId: ' + Cloud.sessionId, textAlign: 'left',
			height: 40 + Utils.u, left: 20 + Utils.u, right: 20 + Utils.u
	}));

	return win;
};