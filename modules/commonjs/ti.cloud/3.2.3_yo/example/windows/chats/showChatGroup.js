windowFunctions['Show Chat Group'] = function (evt) {
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

    var win = createWindow();
    var offset = addBackButton(win);

    var message = Ti.UI.createTextField({
        hintText: 'Enter chat message',
        top: offset + 10 + u, left: 10 + u, right: 10 + u,
        height: 40 + u,
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
        top: offset + 60 + u, bottom: 0
    });
    win.add(tableView);

    function responseHandler(e) {
        if (e.success) {
            for (var i = 0, l = e.chats.length; i < l; i++) {
                receivedNewMessage(e.chats[i]);
            }
        }
        else {
            error(e);
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
            top: 10 + u, right: 10 + u, left: 10 + u,
            font: { fontSize: 9, fontWeight: 'bold' },
            height: 10 + u
        }));
        container.add(Ti.UI.createLabel({
            text: new Date(chat.updated_at).toLocaleTimeString(),
            top: 10 + u, right: 10 + u,
            font: { fontSize: 8 },
            height: 10 + u, width: 'auto'
        }));
        container.add(Ti.UI.createLabel({
            text: chat.message, textAlign: 'left',
            height: 'auto',
            top: 20 + u, right: 10 + u, left: 10 + u, bottom: 10 + u
        }));
        var removeMessage = Ti.UI.createButton({
	        title: 'Delete',
	        color: '#000', backgroundColor: '#f00',
	        style: 0,
	        top: 20 + u, right: 10 + u, bottom: 10 + u,
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
		            error(e);
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
    win.open();
};