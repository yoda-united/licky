var WindowManager = require('helper/WindowManager');
var Utils = require('helper/Utils');
var Cloud = require('ti.cloud');

var WindowManager = require('helper/WindowManager');
var Utils = require('helper/Utils');
var Cloud = require('ti.cloud');
exports['Show Chat Group'] = function (evt) {
    var pingData = {}, createData = {};
    var ids = {};
    if (evt.id) {
        pingData.chat_group_id = createData.chat_group_id = evt.id;
    }
    else if (evt.ids) {
        pingData.participate_ids = createData.to_ids = evt.ids.join(',');
    }
    else {
        alert('Invalid use of Show Chat Groups! Must pass in id or ids!');
        return;
    }

    var win = WindowManager.createWindow({
        backgroundColor: 'white'
    });

    var message = Ti.UI.createTextField({
        hintText: 'Enter chat message',
        top: 10 + Utils.u, left: 10 + Utils.u, right: 10 + Utils.u,
        height: 40 + Utils.u,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED
    });
    message.addEventListener('return', function (evt) {
        if (!message.value) {
            return;
        }
        createData.message = message.value;
        message.value = '';
        Cloud.Chats.create(createData, responseHandler);
        message.focus();
    });
    win.add(message);

    var tableView = Ti.UI.createTableView({
        top: 60 + Utils.u, bottom: 0
    });
    win.add(tableView);

    function responseHandler(e) {
        if (e.success) {
            for (var i = 0, l = e.chats.length; i < l; i++) {
                receivedNewMessage(e.chats[i]);
            }
        }
        else {
            Utils.error(e);
        }

    }

    function receivedNewMessage(chat) {
        // Make sure we only add a message once.
        if (ids[chat.id])
            return;
        ids[chat.id] = true;
        var chat_id = chat.id;

        // Update our query so we only get new messages.
        pingData.where = { updated_at: { '$gt': chat.updated_at } };

        // Add the chat message to the window.
        var row = Ti.UI.createTableViewRow({
        });
        var container = Ti.UI.createView({
            height: Ti.UI.SIZE || 'auto',
            backgroundColor: '#fff',
            borderColor: '#ccc', borderWeight: 1
        });
        container.add(Ti.UI.createLabel({
            text: chat.from.first_name + ' ' + chat.from.last_name, textAlign: 'left',
            top: 10 + Utils.u, right: 10 + Utils.u, left: 10 + Utils.u,
            font: { fontSize: 9, fontWeight: 'bold' },
            height: 10 + Utils.u
        }));
        container.add(Ti.UI.createLabel({
            text: new Date(chat.updated_at).toLocaleTimeString(),
            top: 10 + Utils.u, right: 10 + Utils.u,
            font: { fontSize: 8 },
            height: 10 + Utils.u, width: 'auto'
        }));
        container.add(Ti.UI.createLabel({
            text: chat.message, textAlign: 'left',
            height: 'auto',
            top: 20 + Utils.u, right: 10 + Utils.u, left: 10 + Utils.u, bottom: 10 + Utils.u
        }));
        var removeMessage = Ti.UI.createButton({
	        title: 'Delete',
	        color: '#000', backgroundColor: '#f00',
	        style: 0,
	        top: 20 + Utils.u, right: 10 + Utils.u, bottom: 10 + Utils.u,
	        height: 'auto', width: 'auto',
	        chat_id: chat.id
	    });
	    removeMessage.addEventListener('click', function (evt) {
	    	Cloud.Chats.remove({
	    		chat_id: chat_id
	    	}, function(e) {
	    		if (e.success) {
		            alert('Message successfully removed!');
		            tableView.deleteRow(row);
		        }
		        else {
		            Utils.error(e);
		        }
	    	});
	    });
	    container.add(removeMessage);
        row.add(container);
        if (tableView.data.length == 0 || tableView.data[0].rows.length == 0) {
            tableView.appendRow(row);
        }
        else {
            tableView.insertRowBefore(0, row);
        }
    }

    function ping() {
        Cloud.Chats.query(pingData, responseHandler);
    }

    var pingID = setInterval(ping, 5000);

    win.addEventListener('open', function () {
        message.focus();
        ping();
    });

    win.addEventListener('close', function (evt) {
        clearInterval(pingID);
    });
    return win;
};