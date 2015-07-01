var WindowManager = require('helper/WindowManager');
var Utils = require('helper/Utils');
var Cloud = require('ti.cloud');
exports['Show Event'] = function (evt) {
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

    Cloud.Events.show({
        event_id: evt.id
    }, function (e) {
        content.remove(status);

        var update = Ti.UI.createButton({
            title: 'Update Event',
            top: 10 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u, bottom: 10 + Utils.u,
            height: 40 + Utils.u
        });
        update.addEventListener('click', function () {
            WindowManager.handleOpenWindow({ target: 'Update Event', id: evt.id });
        });
        content.add(update);

        var remove = Ti.UI.createButton({
            title: 'Remove Event',
            top: 10 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u, bottom: 10 + Utils.u,
            height: 40 + Utils.u
        });
        remove.addEventListener('click', function () {
            WindowManager.handleOpenWindow({ target: 'Remove Event', id: evt.id });
        });
        content.add(remove);

	    var occurrences = Ti.UI.createButton({
	        title: 'Show Occurrences',
	        top: 10 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u, bottom: 10 + Utils.u,
	        height: 40 + Utils.u
        });
        occurrences.addEventListener('click', function () {
            WindowManager.handleOpenWindow({ target: 'Show Event Occurrences', id: evt.id });
        });
        content.add(occurrences);

        if (e.success) {
            Utils.enumerateProperties(content, e.events[0], 20);
        } else {
            Utils.error(e);
        }
    });

    return win;
};